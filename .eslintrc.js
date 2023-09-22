module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    project: [
      './packages/accounts/*/tsconfig.json',
      './packages/avatars/*/tsconfig.json',
      './packages/dates/*/tsconfig.json',
      './packages/files/*/tsconfig.json',
      './packages/users/*/tsconfig.json',
      './packages/otp/*/tsconfig.json',
      './packages/profiles/*/tsconfig.json',
      './packages/calendars/*/tsconfig.json',
      './packages/common/*/tsconfig.json',
      './packages/core/*/tsconfig.json',
    ],
    tsconfigRootDir: './',
    extraFileExtensions: ['.vue'],
  },
  plugins: ['vue', 'prettier', '@typescript-eslint/eslint-plugin', 'import', '@nx'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        project: 'packages/*/tsconfig.json',
      },
    },
  },
  rules: {
    '@nx/enforce-module-boundaries': [
      'error',
      {
        allow: [],
        banTransitiveDependencies: true,
      },
    ],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]\\s*|[a-z](IF|Interface)$',
          match: true,
        },
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/ban-types': 'off',
    'object-curly-spacing': ['error', 'always'],
    //'import/named': 'off',
    'import/no-unresolved': 'off',
    'import/no-named-as-default-member': 'off',
    'multiline-ternary': ['error', 'always-multiline'],
    'function-call-argument-newline': ['error', 'consistent'],
  },
  ignorePatterns: ['.eslintrc.js', '*.d.ts'],
};
