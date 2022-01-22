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
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'no-case-declarations': 'off',
    '@typescript-eslint/no-namespace': 'off'
  },
  ignorePatterns: ['**/output/**', '**/node_modules/**', '**/*.js']
};
