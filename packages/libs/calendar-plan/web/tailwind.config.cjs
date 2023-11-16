const baseConfig = require('@lyvely/configs/tailwind/tailwind.config');

module.exports = {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    //path.join(path.dirname(require.resolve('@lyvely/ui')), '**/*.js'),
    // This is more performant but only works here in monorepo structure
  ],
};
