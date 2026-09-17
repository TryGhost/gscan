const {validateGetFilter} = require('../lib/utils/validate-get-filter');

const types = issues => issues.map(issue => issue.type);

describe('validateGetFilter', function () {
    describe('syntax', function () {
        it('accepts valid NQL', function () {
            expect(validateGetFilter('posts', 'featured:true+tag:-hash-hidden')).toEqual([]);
        });

        it('reports invalid NQL', function () {
            const issues = validateGetFilter('posts', 'featured:tru e');

            expect(types(issues)).toEqual(['syntax']);
            expect(issues[0].message).toMatch(/is not valid NQL/);
        });

        it('reports an unbalanced group', function () {
            expect(types(validateGetFilter('posts', '(featured:true'))).toEqual(['syntax']);
        });

        it('ignores an empty or missing filter', function () {
            expect(validateGetFilter('posts', '')).toEqual([]);
            expect(validateGetFilter('posts', '   ')).toEqual([]);
            expect(validateGetFilter('posts', undefined)).toEqual([]);
        });

        it('ignores a resource {{#get}} cannot fetch', function () {
            expect(validateGetFilter('widgets', 'featured:tru e')).toEqual([]);
        });
    });

    describe('interpolated values', function () {
        it('accepts a filter built from a template value', function () {
            expect(validateGetFilter('posts', 'id:-{{id}}')).toEqual([]);
            expect(validateGetFilter('posts', 'tags:[{{post.tags}}]')).toEqual([]);
            expect(validateGetFilter('posts', 'tag:{{slug}}+featured:true')).toEqual([]);
        });

        it('does not report syntax errors when the filter is partly dynamic', function () {
            // `{{custom.extra_filter}}` could resolve to anything, including
            // operators, so we cannot judge the syntax of the whole filter.
            expect(validateGetFilter('posts', '{{custom.extra_filter}}+featured:true')).toEqual([]);
        });

        it('still reports problems in the static part of a dynamic filter', function () {
            expect(types(validateGetFilter('posts', 'plaintext:~\'x\'+tag:{{slug}}'))).toEqual(['restricted']);
        });

        it('does not report a field name that is itself interpolated', function () {
            expect(validateGetFilter('posts', '{{custom.field}}:true')).toEqual([]);
        });
    });

    describe('restricted fields', function () {
        it('reports fields the Content API silently drops', function () {
            const issues = validateGetFilter('posts', 'plaintext:~\'ghost\'');

            expect(types(issues)).toEqual(['restricted']);
            expect(issues[0].message).toMatch(/silently drops it/);
            expect(issues[0].message).toMatch(/more posts than expected/);
        });

        it('matches any segment of a relation-qualified field, like Ghost does', function () {
            expect(types(validateGetFilter('posts', 'authors.email:~\'ghost.org\''))).toEqual(['restricted']);
        });

        it('names the resource being fetched', function () {
            expect(validateGetFilter('authors', 'email:~\'ghost.org\'')[0].message)
                .toMatch(/more authors than expected/);
        });

        it('leaves fields that are not restricted alone', function () {
            expect(validateGetFilter('posts', 'visibility:public')).toEqual([]);
            expect(validateGetFilter('posts', 'created_at:>\'2024-01-01\'')).toEqual([]);
            expect(validateGetFilter('posts', 'primary_author.slug:jim')).toEqual([]);
            expect(validateGetFilter('tags', 'visibility:public')).toEqual([]);
        });

        it('does not guess at fields it knows nothing about', function () {
            // A typo'd or newly added field is indistinguishable without mirroring
            // Ghost's schema, so we say nothing rather than warn about valid themes.
            expect(validateGetFilter('posts', 'catgory:news')).toEqual([]);
        });

        it('reports each restricted field once', function () {
            const issues = validateGetFilter('posts', 'plaintext:~\'a\'+featured:true+html:~\'b\'');

            expect(types(issues)).toEqual(['restricted', 'restricted']);
        });
    });

    describe('grouped queries', function () {
        it('walks into $and/$or groups', function () {
            expect(types(validateGetFilter('posts', '(featured:true,plaintext:~\'x\')+tag:y'))).toEqual(['restricted']);
        });

        it('walks into negated statements', function () {
            expect(types(validateGetFilter('posts', 'plaintext:-null'))).toEqual(['restricted']);
        });
    });
});
