
module.exports = {
    // require.resolve 会报错
    preset: './node_modules/@reskript/config-jest/config/jest-react.js',
    testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{js,jsx,ts,tsx}'],
};
