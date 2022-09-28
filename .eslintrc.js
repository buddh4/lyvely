module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  plugins: ['vue', 'prettier', '@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    "plugin:vue/vue3-recommended",
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['.eslintrc.js', '*.d.ts'],
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: [
          './packages/web/tsconfig.json',
          './packages/common/tsconfig.json',
          './packages/server/tsconfig.json',
          './packages/demo-web/tsconfig.json',
          './packages/demo-server/tsconfig.json',
        ],
        sourceType: 'module',
        extraFileExtensions: [ ".vue" ]
      },
      rules: {
        "@typescript-eslint/naming-convention": [
          "warn",
          {
            "selector": "interface",
            "format": ["PascalCase"],
            "custom": {
              "regex": "^I[A-Z]\\s*|[a-z](IF|Interface)$",
              "match": true
            }
          }
        ],
        "@typescript-eslint/no-non-null-assertion": "off",
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-types': 'off',
        'object-curly-spacing': ["error", "always"],
        'import/named': 'off',
        'import/no-unresolved': 'off',
        "function-call-argument-newline":  ['error', 'consistent']
      },
    },
    {
      files: ['**/*.spec.ts', 'integration/**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.spec.json',
        sourceType: 'module',
      },
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
      },
    }
  ],
};
