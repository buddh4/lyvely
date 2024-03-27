/** @type {import('dependency-cruiser').IConfiguration} */

const preset = require('@lyvely/devtools/dependency-cruiser/.dependency-cruiser.preset');

function getModulePath(name) {
  return `^src/${name}`;
}

const CORE_DEPS = [];

function extendDefaults(arr) {
  arr = arr || [];
  arr.push(...CORE_DEPS);
  return arr;
}

function createModuleDeps(name, allowedDeps, extendDefaultDeps) {
  const self = getModulePath(name);
  allowedDeps = allowedDeps || [];
  extendDefaultDeps = extendDefaultDeps ?? true;
  if (extendDefaultDeps) {
    allowedDeps = extendDefaults(allowedDeps);
  }
  return {
    name: `module-${name}-deps`,
    from: { path: self },
    to: { pathNot: [self, ...allowedDeps] },
  };
}

module.exports = {
  forbidden: [
    ...preset.forbidden,
    /* module dependency restrictions: */
  ],
  options: preset.options,
};
