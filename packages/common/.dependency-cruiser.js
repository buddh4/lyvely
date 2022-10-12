/** @type {import('dependency-cruiser').IConfiguration} */

const preset = require('../../.dependency-cruiser.preset');

function getModulePath(name) {
  return `^(@|src)/${name}`;
}

const MODULE_ACTIVITIES = getModulePath('activities');
const MODULE_CALENDAR = getModulePath('calendar');
const MODULE_CONTENT = getModulePath('content');
const MODULE_MAPPINGS = getModulePath('mappings');
const MODULE_MODELS = getModulePath('models');
const MODULE_PROFILES = getModulePath('profiles');
const MODULE_STATISTICS = getModulePath('statistics');
const MODULE_TAGS = getModulePath('tags');
const MODULE_TIME_SERIES = getModulePath('time-series');
const MODULE_TYPES = getModulePath('types');
const MODULE_USER_INVITES = getModulePath('user-invites');
const MODULE_USERS = getModulePath('users');
const MODULE_UTILS = getModulePath('utils');
const MODULE_ENDPOINTS = getModulePath('endpoints');
const MODULE_VALIDATION = getModulePath('validation');
const MODULE_WEB = getModulePath('web');
const MODULE_COLLAB = getModulePath('collab');

const NODE_MODULES = 'node_modules';
const NODE_CORE = '^((?!\\/).)*$';

const CORE_DEPS = [NODE_MODULES, NODE_CORE];

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
    createModuleDeps('activities', [
      MODULE_CALENDAR,
      MODULE_TIME_SERIES,
      MODULE_CONTENT,
      MODULE_MODELS,
      MODULE_TAGS,
      MODULE_COLLAB,
      MODULE_VALIDATION,
    ]),
    createModuleDeps('app-config', [MODULE_ENDPOINTS]),
    createModuleDeps('auth', [MODULE_ENDPOINTS, MODULE_USERS]),
    createModuleDeps('calendar'),
    createModuleDeps('collab'),
    createModuleDeps('content', [MODULE_MODELS, MODULE_TAGS]),
    createModuleDeps('mappings', [MODULE_MODELS, MODULE_UTILS]),
    createModuleDeps('models', [MODULE_UTILS]),
    createModuleDeps('profiles', [MODULE_TAGS, MODULE_MODELS, MODULE_ENDPOINTS]),
    createModuleDeps('statistics', [MODULE_CALENDAR]),
    createModuleDeps('tags', [MODULE_MODELS]),
    createModuleDeps('time-series', [MODULE_CALENDAR, MODULE_MODELS, MODULE_CONTENT, MODULE_COLLAB]),
    createModuleDeps('types'),
    createModuleDeps('user-invites', [MODULE_ENDPOINTS, MODULE_PROFILES, MODULE_MODELS]),
    createModuleDeps('users', [MODULE_MODELS]),
    createModuleDeps('utils'),
    createModuleDeps('validation'),
    createModuleDeps('web'),
  ],
  options: preset.options,
};
// generated: dependency-cruiser@11.15.0 on 2022-09-13T13:28:20.933Z
