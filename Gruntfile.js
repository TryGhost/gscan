module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        // ### grunt-mocha-istanbul
        // Configuration for the mocha test coverage generator
        // `grunt coverage`.
        mocha_istanbul: {
            coverage: {
                src: ['test'],
                options: {
                    mask: '*test.js',
                    coverageFolder: 'test/coverage',
                    excludes: ['public', 'uploads', 'tmp', 'tpl']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-istanbul');

    grunt.registerTask('coverage', 'Generate unit and integration (mocha) tests coverage report',
        ['mocha_istanbul:coverage']
    );
};
