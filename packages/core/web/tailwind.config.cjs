const baseConfig = require('@lyvely/configs/tailwind/tailwind.config');

module.exports = {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '../../libs/ui/src/**/*.{vue,js,ts,jsx,tsx}',
    '../../libs/calendar-plan/web/src/**/*.{vue,js,ts,jsx,tsx}',
    '../../libs/time-series/web/src/**/*.{vue,js,ts,jsx,tsx}',
    '../../features/tasks/web/src/**/*.{vue,js,ts,jsx,tsx}',
    '../../features/habits/web/src/**/*.{vue,js,ts,jsx,tsx}',
    '../../features/activities/web/src/**/*.{vue,js,ts,jsx,tsx}',
    '../../features/legal/web/src/**/*.{vue,js,ts,jsx,tsx}',
    '../../features/milestones/web/src/**/*.{vue,js,ts,jsx,tsx}',
    '../../features/statistics/web/src/**/*.{vue,js,ts,jsx,tsx}',
    //path.join(path.dirname(require.resolve('@lyvely/ui')), '**/*.js'),
    // This is more performant but only works here in monorepo structure
  ],
};
