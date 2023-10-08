const baseConfig = require('@lyvely/configs/tailwind/tailwind.config');
const path = require('path');

module.exports = {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    //path.join(path.dirname(require.resolve('@lyvely/ui')), '**/*.js'),
    // This is more performant but only works here in monorepo structure
    '../../libs/ui/src/**/*.{vue,js,ts,jsx,tsx}',
  ],
};
