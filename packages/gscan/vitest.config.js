'use strict';

const {defineConfig} = require('vitest/config');

module.exports = defineConfig({
    test: {
        globals: true,
        dir: './test',
        fileParallelism: false,
        server: {
            deps: {
                inline: ['uuid', '@tryghost/errors']
            }
        },
        coverage: {
            provider: 'v8',
            include: ['lib/**/*.js', 'bin/**/*.js'],
            exclude: ['lib/faker/**'],
            reporter: ['html', 'text-summary'],
            thresholds: {
                statements: 97,
                branches: 95,
                functions: 97,
                lines: 97
            }
        }
    }
});
