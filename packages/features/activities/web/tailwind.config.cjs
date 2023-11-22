const baseConfig = require('@lyvely/devtools/tailwind/tailwind.config');

module.exports = {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    require.resolve('@lyvely/ui/tailwind.txt'),
    require.resolve('@lyvely/web/tailwind.txt'),
    require.resolve('@lyvely/milestones-web/tailwind.txt'),
    require.resolve('@lyvely/tasks-web/tailwind.txt'),
    require.resolve('@lyvely/habits-web/tailwind.txt'),
  ]
};
