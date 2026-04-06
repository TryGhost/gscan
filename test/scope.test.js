const Scope = require('../lib/ast-linter/rules/internal/scope');

describe('Scope internals', function () {
    it('supports allowlisted global and data variables', function () {
        const scope = new Scope();
        // @site is a known global
        expect(scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: true, parts: ['site'], depth: 0}
        })).toBe(true);

        // @index is a known data variable
        expect(scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: true, parts: ['index'], depth: 0}
        })).toBe(true);

        // @unknown is not
        expect(scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: true, parts: ['unknown'], depth: 0}
        })).toBe(false);
    });

    it('creates template frames for known template types', function () {
        // post-*.hbs templates should create frames without throwing
        const scope = new Scope();
        scope.pushTemplateFrame('post-featured.hbs', {type: 'Program'});
        expect(scope.currentFrame).toBeDefined();

        // page-*.hbs templates
        const scope2 = new Scope();
        scope2.pushTemplateFrame('page-contact.hbs', {type: 'Program'});
        expect(scope2.currentFrame).toBeDefined();

        // custom-*.hbs templates
        const scope3 = new Scope();
        scope3.pushTemplateFrame('custom-about.hbs', {type: 'Program'});
        expect(scope3.currentFrame).toBeDefined();

        // index.hbs has no template context — pushTemplateFrame throws a deliberate error
        expect(() => {
            const scope4 = new Scope();
            scope4.pushTemplateFrame('index.hbs', {type: 'Program'});
        }).toThrow('No template context found for template: index.hbs');
    });

    it('validates block statements when creating contexts', function () {
        const scope = new Scope();
        scope.pushTemplateFrame('post.hbs', {type: 'Program'});

        const blockNode = {type: 'BlockStatement', path: {data: false, parts: ['if']}};
        scope.pushFrame(blockNode);
        expect(scope.frames.length).toBe(2);
        expect(scope.currentFrame.context).toBe('str');
        expect(scope.currentFrame.locals).toEqual({});

        // MustacheStatement cannot be used to construct a Frame
        expect(() => scope.pushFrame({type: 'MustacheStatement', path: {data: false, parts: ['if']}}))
            .toThrow(/cannot be used to construct a Frame/);
    });

    it('validates frame construction inputs', function () {
        // Program without fileName should throw
        expect(() => {
            const scope = new Scope();
            scope.pushTemplateFrame(undefined, {type: 'Program'});
        }).toThrow(/fileName must be passed/);
    });

    it('manages stack frames and parent context lookups', function () {
        const scope = new Scope();
        expect(scope.currentFrame).toBeUndefined();
        expect(scope.isContext('post')).toBe(false);
        expect(scope.hasParentContext('post')).toBe(false);
        expect(scope.getParentContextNode('post')).toBeNull();

        scope.pushTemplateFrame('post.hbs', {type: 'Program'});
        expect(scope.currentFrame).toBeDefined();

        const blockNode = {type: 'BlockStatement', path: {data: false, parts: ['foreach']}};
        scope.pushFrame(blockNode);
        expect(scope.frames.length).toBe(2);
        expect(scope.hasParentContext('foreach')).toBe(true);
        expect(scope.getParentContextNode('foreach')).toBe(blockNode);

        scope.popFrame();
        expect(scope.frames.length).toBe(1);
    });

    it('resolves known variables from globals and local frame state', function () {
        const scope = new Scope();
        scope.frames = [{
            isLocal(name) {
                return name === 'localValue';
            }
        }];

        expect(scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: true, parts: ['site'], depth: 0}
        })).toBe(true);

        expect(scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: true, parts: ['not_on_allowlist'], depth: 0}
        })).toBe(false);

        expect(scope.isKnownVariable({
            type: 'PathExpression',
            parts: ['member']
        })).toBe(true);

        expect(scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: false, parts: ['localValue'], depth: 0}
        })).toBe(true);

        expect(scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: false, parts: ['missingLocal'], depth: 0}
        })).toBeUndefined();
    });

    it('throws when Scope is initialized with templateFileName', function () {
        expect(() => new Scope({templateFileName: 'post.hbs'})).toThrow();
    });
});
