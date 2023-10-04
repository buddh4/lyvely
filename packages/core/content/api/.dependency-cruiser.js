/** @type {import('dependency-cruiser').IConfiguration} */

const preset = require('../../configs/dependency-cruiser/.dependency-cruiser.preset');

function getModulePath(name) {
  return `^src/${name}[^-]`;
}

const MODULE_COMPONENTS = getModulePath('components');
const MODULE_CONTROLLERS = getModulePath('controllers');
const MODULE_DAOS = getModulePath('daos');
const MODULE_DECORATORS = getModulePath('decorators');
const MODULE_GUARDS = getModulePath('guards');
const MODULE_INTERFACES = getModulePath('interfaces');
const MODULE_MODELS = getModulePath('models');
const MODULE_POLICIES = getModulePath('policies');
const MODULE_SCHEMAS = getModulePath('schemas');
const MODULE_SERVICES = getModulePath('services');
const MODULE_TESTING = getModulePath('testing');
const MODULE_TYPES = getModulePath('types');
const NODE_MODULES = 'node_modules';
const NODE_CORE = '^((?!\\/).)*$';
const NODE_LYVELY = '^../';

const CORE_DEPS = [NODE_MODULES, NODE_CORE, NODE_LYVELY];

function extendDefaults(arr) {
  arr = arr || [];
  arr.push(...CORE_DEPS);
  return arr;
}

function createModuleDeps(name, allowedDeps, extendDefaultDeps) {
  const self = getModulePath(name);
  allowedDeps = allowedDeps || [];
  extendDefaultDeps ??= true;
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
  forbidden: [...preset.forbidden],
  options: preset.options,
};
