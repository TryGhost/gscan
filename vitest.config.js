'use strict';

const {defineConfig} = require('vitest/config');

module.exports = defineConfig({
    test: {
        globals: true,
        include: ['test/**/*.test.js'],
        fileParallelism: false,
        server: {
            deps: {
                inline: ['uuid', '@tryghost/errors']
            }
        },
        coverage: {
            provider: 'v8',
            all: true,
            include: [
                'lib/**/*.js',
                'bin/*.js'
            ],
            exclude: ['coverage/**'],
            reporter: ['html', 'text-summary'],
            thresholds: {
                statements: 95,
                branches: 95,
                functions: 95,
                lines: 95
            }
        }
    }
});
