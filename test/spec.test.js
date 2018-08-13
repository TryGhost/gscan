const should = require('should'); // eslint-disable-line no-unused-vars
const rewire = require('rewire');

const specs = require('../lib/specs');

describe('Specs', function () {
    describe('getter', function () {
        it('returns a valid ruleset', function () {
            const v1Spec = specs.get('v1');
            const latestSpec = specs.get('latest');

            v1Spec.should.be.an.Object().with.keys(
                'knownHelpers',
                'templates',
                'rules'
            );

            latestSpec.should.be.an.Object().with.keys(
                'knownHelpers',
                'templates',
                'rules'
            );
        });
    });

    describe('v1 spec', function () {
        let v1Spec;

        it('returns v1', function () {
            v1Spec = require('../lib/specs/v1');

            v1Spec.should.be.an.Object().with.keys(
                'knownHelpers',
                'templates',
                'rules'
            );

            v1Spec.knownHelpers.should.be.an.Array().with.lengthOf(46);
            v1Spec.templates.should.be.an.Array().with.lengthOf(10);
            v1Spec.rules.should.be.an.Object();
            Object.keys(v1Spec.rules).length.should.eql(49);
            Object.keys(v1Spec.rules).should.containEql('GS002-DISQUS-ID');
        });
    });

    describe('latest spec', function () {
        it('returns merged specs', function () {
            const latest = rewire('../lib/specs/latest');

            latest.knownHelpers.should.be.an.Array().with.lengthOf(46);
            latest.templates.should.be.an.Array().with.lengthOf(10);
            latest.rules.should.be.an.Object();
            Object.keys(latest.rules).length.should.eql(92);

            Object.keys(latest.rules).should.not.containEql('GS002-DISQUS-ID');

            console.log(Object.keys(latest.rules));
        });
    });
});
