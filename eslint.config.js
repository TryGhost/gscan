const {FlatCompat} = require('@eslint/eslintrc');
const {fixupConfigRules} = require('@eslint/compat');
const js = require('@eslint/js');
const ghostPlugin = require('eslint-plugin-ghost');

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const withGhostPlugin = config => ({
    ...config,
    plugins: Array.from(new Set([...(config.plugins || []), 'ghost']))
});

const ghostNodeConfig = {
    ...withGhostPlugin(ghostPlugin.configs.node),
    rules: {
        ...ghostPlugin.configs.node.rules,
        'ghost/filenames/match-exported-class': 'off',
        'ghost/ghost-custom/no-native-error': 'off'
    }
};

const ghostTestConfig = {
    ...withGhostPlugin(ghostPlugin.configs.test),
    rules: {
        ...ghostPlugin.configs.test.rules,
        'ghost/ghost-custom/no-native-error': 'off',
        'padded-blocks': 'off'
    }
};

const ghostBrowserConfig = withGhostPlugin(ghostPlugin.configs.browser);

module.exports = [
    {
        ignores: [
            'coverage/**',
            'test/fixtures/**'
        ]
    },
    ...fixupConfigRules(compat.config(ghostNodeConfig)),
    ...fixupConfigRules(compat.config(ghostTestConfig)).map(config => ({
        ...config,
        files: ['test/**/*.js'],
        languageOptions: {
            ...(config.languageOptions || {}),
            globals: {
                ...(config.languageOptions && config.languageOptions.globals ? config.languageOptions.globals : {}),
                afterAll: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                beforeEach: 'readonly',
                describe: 'readonly',
                expect: 'readonly',
                it: 'readonly',
                test: 'readonly'
            }
        }
    })),
    ...fixupConfigRules(compat.config(ghostBrowserConfig)).map(config => ({
        ...config,
        files: ['app/public/**/*.js']
    })),
    {
        rules: {
            'max-lines': 'off',
            'no-useless-assignment': 'off',
            'no-unused-vars': ['error', {
                caughtErrors: 'none'
            }]
        }
    }
];
