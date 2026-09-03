const createLimiter = require('../lib/utils/create-limiter');

describe('createLimiter', function () {
    it('runs up to `max` tasks immediately', async function () {
        const limit = createLimiter(2);
        const order = [];
        let releaseA;
        let releaseB;

        const a = limit(() => new Promise((resolve) => {
            releaseA = resolve;
        })).then(() => order.push('a'));
        const b = limit(() => new Promise((resolve) => {
            releaseB = resolve;
        })).then(() => order.push('b'));

        // both should have started synchronously (no third task to queue behind)
        await Promise.resolve();
        expect(releaseA).toBeDefined();
        expect(releaseB).toBeDefined();

        releaseA();
        releaseB();
        await Promise.all([a, b]);
        expect(order).toEqual(['a', 'b']);
    });

    it('queues extra tasks until a slot frees up', async function () {
        const limit = createLimiter(1);
        const started = [];
        let releaseFirst;

        const first = limit(() => {
            started.push('first');
            return new Promise((resolve) => {
                releaseFirst = resolve;
            });
        });
        const second = limit(() => {
            started.push('second');
            return Promise.resolve();
        });

        // give the microtask queue a chance to run - `second` must NOT have started yet
        await Promise.resolve();
        await Promise.resolve();
        expect(started).toEqual(['first']);

        releaseFirst();
        await first;
        await second;
        expect(started).toEqual(['first', 'second']);
    });

    it('never exceeds `max` concurrent executions under load', async function () {
        const limit = createLimiter(3);
        let active = 0;
        let peak = 0;

        const tasks = Array.from({length: 20}, () => limit(() => {
            active += 1;
            peak = Math.max(peak, active);

            return new Promise((resolve) => {
                setTimeout(resolve, 10);
            }).then(() => {
                active -= 1;
            });
        }));

        await Promise.all(tasks);

        expect(peak).toBeLessThanOrEqual(3);
        // sanity check that tasks actually overlapped rather than running strictly
        // one at a time (which would also satisfy the assertion above vacuously)
        expect(peak).toBeGreaterThan(1);
    });

    it('propagates rejections without blocking the queue', async function () {
        const limit = createLimiter(1);
        const err = new Error('boom');

        const first = limit(() => Promise.reject(err));
        const second = limit(() => Promise.resolve('ok'));

        await expect(first).rejects.toBe(err);
        await expect(second).resolves.toEqual('ok');
    });
});
