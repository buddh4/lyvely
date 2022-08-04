module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:prettier/recommended"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "parser": "@typescript-eslint/parser",
    "sourceType": "module",
    "project": "tsconfig.json",
    "tsconfigRootDir": "./",
    "extraFileExtensions": [ ".vue" ]
  },
  "plugins": [
    "vue",
    "@typescript-eslint"
  ],
  "rules": {
    "prettier/prettier": 0,
    "@typescript-eslint/explicit-module-boundary-types": "off"
  }
}
