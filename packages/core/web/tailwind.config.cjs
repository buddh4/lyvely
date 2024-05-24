const baseConfig = require('@lyvely/devtools/tailwind/tailwind.config');

const content = [...baseConfig.content];

content.push(require.resolve('@lyvely/ui/tailwind.txt'));

module.exports = {
  ...baseConfig,
  content,
};
