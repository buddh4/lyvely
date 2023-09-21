const baseConfig = require("@lyvely/configs/tailwind/tailwind.config");

module.exports = {
  ...baseConfig,
  content: [
    './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'
  ]
};
