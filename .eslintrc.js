module.exports = {
    extends: './node_modules/reskript/config/eslint.js',
    rules: {
        'camelcase': ['error', {allow: ['^unstable_']}]
    }
};
