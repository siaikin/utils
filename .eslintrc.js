module.exports = {
  root: true,
  globals: {
    __VERSION_INFO__: 'readonly'
  },
  env: {
    browser: true,
    node: true,
    'jest/globals': true
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/all',
  ],
  rules: {
    'no-case-declarations': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'quotes': ['error', 'single'],
    'jest/no-commented-out-tests': 'off',
    'jest/require-to-throw-message': 'off'
  },
  ignorePatterns: ['**/output/**', '**/node_modules/**', '**/*.js'],

};
