/**
 * Creates a simple counting-semaphore limiter: `limit(fn)` runs `fn`
 * immediately if fewer than `max` calls are currently in flight, otherwise
 * queues it (FIFO) until a slot frees up.
 *
 * Used to bound how many concurrent filesystem operations a recursive walk
 * can have in flight at once, regardless of how wide/deep the tree is -
 * unlike `Promise.all(items.map(doWork))`, which starts every operation
 * immediately no matter how many `items` there are.
 *
 * @param {number} max - maximum concurrent executions of `fn`
 * @returns {(fn: () => Promise<any>) => Promise<any>}
 */
function createLimiter(max) {
    let active = 0;
    const queue = [];

    const runNext = function runNext() {
        if (active >= max || queue.length === 0) {
            return;
        }

        active += 1;
        const {fn, resolve, reject} = queue.shift();

        fn().then(resolve, reject).finally(() => {
            active -= 1;
            runNext();
        });
    };

    return function limit(fn) {
        return new Promise((resolve, reject) => {
            queue.push({fn, resolve, reject});
            runNext();
        });
    };
}

module.exports = createLimiter;
