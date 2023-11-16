const baseConfig = require('@lyvely/configs/tailwind/tailwind.config');

module.exports = {
  ...baseConfig,
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
};
