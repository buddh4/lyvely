const baseConfig = require('@lyvely/devtools/tailwind/tailwind.config');

const content = [...baseConfig.content];

// This will is used for a rendering a proper dev environment.
if(process.env.NODE_ENV === 'development') {
  content.push(require.resolve('@lyvely/ui/style.css'), require.resolve('@lyvely/web/tailwind.css'))
}

module.exports = {
  ...baseConfig,
  content
};
