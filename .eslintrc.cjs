require('@reskript/config-lint/patch');

module.exports = {
    extends: require.resolve('@reskript/config-lint/config/eslint'),
    rules: {
        'camelcase': ['error', {allow: ['^unstable_']}],
        'no-use-before-define': 'off',
    },
};
