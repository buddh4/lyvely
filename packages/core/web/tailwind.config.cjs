const baseConfig = require('@lyvely/devtools/tailwind/tailwind.config');

const content = [...baseConfig.content];

console.log(process.env.NODE_ENV);

// This will is used for a rendering a proper dev environment.
//if(process.env.NODE_ENV === 'development') {
content.push(require.resolve('@lyvely/ui/tailwind.txt'))
//}

module.exports = {
  ...baseConfig,
  content
};
