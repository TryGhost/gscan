const should = require('should');
const Scope = require('../lib/ast-linter/rules/internal/scope');

describe('Scope internals', function () {
    it('supports allowlisted global and data variables', function () {
        const scope = new Scope();
        // @site is a known global
        scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: true, parts: ['site'], depth: 0}
        }).should.eql(true);

        // @index is a known data variable
        scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: true, parts: ['index'], depth: 0}
        }).should.eql(true);

        // @unknown is not
        scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: true, parts: ['unknown'], depth: 0}
        }).should.eql(false);
    });

    it('creates template frames for known template types', function () {
        // post-*.hbs templates should create frames without throwing
        const scope = new Scope();
        scope.pushTemplateFrame('post-featured.hbs', {type: 'Program'});
        should.exist(scope.currentFrame);

        // page-*.hbs templates
        const scope2 = new Scope();
        scope2.pushTemplateFrame('page-contact.hbs', {type: 'Program'});
        should.exist(scope2.currentFrame);

        // custom-*.hbs templates
        const scope3 = new Scope();
        scope3.pushTemplateFrame('custom-about.hbs', {type: 'Program'});
        should.exist(scope3.currentFrame);

        // index.hbs has no template context — pushTemplateFrame throws
        // because getTemplateContext returns undefined and destructuring fails
        (() => {
            const scope4 = new Scope();
            scope4.pushTemplateFrame('index.hbs', {type: 'Program'});
        }).should.throw(TypeError);
    });

    it('validates block statements when creating contexts', function () {
        const scope = new Scope();
        scope.pushTemplateFrame('post.hbs', {type: 'Program'});

        const blockNode = {type: 'BlockStatement', path: {data: false, parts: ['if']}};
        scope.pushFrame(blockNode);
        scope.frames.length.should.eql(2);
        scope.currentFrame.context.should.eql('str');
        scope.currentFrame.locals.should.deepEqual({});

        // MustacheStatement cannot be used to construct a Frame
        (() => scope.pushFrame({type: 'MustacheStatement', path: {data: false, parts: ['if']}}))
            .should.throw(/cannot be used to construct a Frame/);
    });

    it('validates frame construction inputs', function () {
        // Program without fileName should throw
        (() => {
            const scope = new Scope();
            scope.pushTemplateFrame(undefined, {type: 'Program'});
        }).should.throw(/fileName must be passed/);
    });

    it('manages stack frames and parent context lookups', function () {
        const scope = new Scope();
        should.equal(scope.currentFrame, undefined);
        scope.isContext('post').should.eql(false);
        scope.hasParentContext('post').should.eql(false);
        should.equal(scope.getParentContextNode('post'), null);

        scope.pushTemplateFrame('post.hbs', {type: 'Program'});
        should.exist(scope.currentFrame);

        const blockNode = {type: 'BlockStatement', path: {data: false, parts: ['foreach']}};
        scope.pushFrame(blockNode);
        scope.frames.length.should.eql(2);
        scope.hasParentContext('foreach').should.eql(true);
        scope.getParentContextNode('foreach').should.eql(blockNode);

        scope.popFrame();
        scope.frames.length.should.eql(1);
    });

    it('resolves known variables from globals and local frame state', function () {
        const scope = new Scope();
        scope.frames = [{
            isLocal(name) {
                return name === 'localValue';
            }
        }];

        scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: true, parts: ['site'], depth: 0}
        }).should.eql(true);

        scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: true, parts: ['not_on_allowlist'], depth: 0}
        }).should.eql(false);

        scope.isKnownVariable({
            type: 'PathExpression',
            parts: ['member']
        }).should.eql(true);

        scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: false, parts: ['localValue'], depth: 0}
        }).should.eql(true);

        should.equal(scope.isKnownVariable({
            type: 'MustacheStatement',
            path: {data: false, parts: ['missingLocal'], depth: 0}
        }), undefined);
    });

    it('throws when Scope is initialized with templateFileName', function () {
        (() => new Scope({templateFileName: 'post.hbs'})).should.throw();
    });
});
