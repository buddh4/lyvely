const resoler = require('./postcss-import.resolver');

const moduleDirectories = ['web_modules', 'node_modules'];

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
