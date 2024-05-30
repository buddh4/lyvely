const commonConfig = require('./common.eslintrc');

module.exports = {
  ...commonConfig,
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    tsconfigRootDir: './',
    extraFileExtensions: ['.vue'],
  },
  plugins: ['vue', 'prettier', '@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
};
