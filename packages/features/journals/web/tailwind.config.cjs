const baseConfig = require('@lyvely/devtools/tailwind/tailwind.config');

module.exports = {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    require.resolve('@lyvely/ui/tailwind.txt'),
    require.resolve('@lyvely/web/tailwind.txt'),
    require.resolve('@lyvely/calendar-plan-web/tailwind.txt'),
    require.resolve('@lyvely/time-series-web/tailwind.txt'),
  ],
};
