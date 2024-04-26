const resoler = require('./postcss-import.resolver.cjs');

module.exports = {
  plugins: {
    'postcss-import': {
      resolve: resoler,
    },
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },

  /*[
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
  ]*/
};
