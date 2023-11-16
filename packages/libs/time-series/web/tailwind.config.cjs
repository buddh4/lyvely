const baseConfig = require('@lyvely/configs/tailwind/tailwind.config');
const path = require('path');

module.exports = {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
};
