const should = require('should');

const {
    Scope,
    Frame,
    getContext,
    getTemplateContext,
    helpers: helperMap,
    isOnAllowlist
} = require('../lib/ast-linter/rules/internal/scope')._private;

describe('Scope internals', function () {
    it('supports allowlisted global and data variables', function () {
        isOnAllowlist(['site']).should.eql(true);
        isOnAllowlist(['index']).should.eql(true);
        isOnAllowlist(['unknown']).should.eql(false);
        isOnAllowlist().should.eql(false);
    });

    it('detects template-level context by filename', function () {
        getTemplateContext('post-featured.hbs').should.have.property('post');
        getTemplateContext('page-contact.hbs').should.have.property('page');

        const customTemplateContext = getTemplateContext('custom-about.hbs');
        customTemplateContext.should.have.property('post');
        customTemplateContext.should.have.property('page');

        should.equal(getTemplateContext('index.hbs'), undefined);
    });

    it('builds helper contexts for get, next_post and prev_post', function () {
        const withAny = function withAny(pairs) {
            return {
                pairs: {
                    any(predicate) {
                        return pairs.some(predicate);
                    }
                }
            };
        };

        should.equal(helperMap.get({
            params: [{value: 'unknowns'}],
            hash: withAny([])
        }), undefined);

        const singularResult = helperMap.get({
            params: [{value: 'posts'}],
            hash: withAny([{key: 'slug'}])
        });
        singularResult.locals.should.have.property('pagination');
        singularResult.blockParams[0].should.be.an.Object();

        const pluralResult = helperMap.get({
            params: [{value: 'posts'}],
            hash: withAny([])
        });
        pluralResult.blockParams[0].should.be.an.Array();

        helperMap.next_post().context.should.eql('post');
        helperMap.prev_post().context.should.eql('post');
    });

    it('validates block statements when creating contexts', function () {
        (() => getContext({type: 'MustacheStatement'})).should.throw(/cannot be used to generate a context/);

        const context = getContext({type: 'BlockStatement'});
        context.should.deepEqual({
            context: 'str',
            locals: {},
            blockParams: {}
        });
    });

    it('validates frame construction inputs', function () {
        (() => new Frame({type: 'Program'})).should.throw(/fileName must be passed/);
        (() => new Frame({type: 'MustacheStatement', path: {data: false, parts: ['if']}})).should.throw(/cannot be used to construct a Frame/);

        const templateFrame = new Frame({type: 'Program'}, {fileName: 'post.hbs'});
        should.exist(templateFrame);

        const blockFrame = new Frame({type: 'BlockStatement', path: {data: false, parts: ['if']}});
        blockFrame.context.should.eql('str');
        blockFrame.locals.should.deepEqual({});
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
