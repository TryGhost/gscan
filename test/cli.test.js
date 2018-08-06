var should = require('should'),
  cli = require('../bin/cli'),
  theme = {
    results: {
      error: [],
      warning: [],
      recommendation: []
    }
  };

describe('Exit codes are set', function () {
  beforeEach(function() {
    theme.results.error = [];
    theme.results.warning = [];
    theme.results.recommendation = [];
  });

  it('Exit code 0 on no errors and no warnings', function() {
    cli.setExitCode(theme);

    process.exitCode.should.be.eql(0);
  });

  it('Exit code 1 on errors (and warnings)', function() {
    theme.results.error = [true];
    theme.results.warning = [true];

    cli.setExitCode(theme);

    process.exitCode.should.be.eql(1);
  });

  it('Exit code 2 on no errors but warnings', function() {
    theme.results.warning = [true];

    cli.setExitCode(theme);

    process.exitCode.should.be.eql(2);
  });
});
