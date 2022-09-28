/** @type {import('dependency-cruiser').IConfiguration} */

const preset = require("../../.dependency-cruiser.preset");

function getModulePath(name) {
  return `^src/modules/${name}`;
}

const MODULE_ACCESSIBILITY = getModulePath("accessibility");
const MODULE_ACTIVITIES = getModulePath("activities");
const MODULE_CALENDAR = getModulePath("calendar");
const MODULE_COMMON = getModulePath("common");
const MODULE_CONTENT = getModulePath("content");
const MODULE_CORE = getModulePath("core");
const MODULE_PROFILES = getModulePath("profiles");
const MODULE_STATISTICS = getModulePath("statistics");
const MODULE_TAGS = getModulePath("tags");
const MODULE_UI = getModulePath("ui");
const MODULE_USERS = getModulePath("users");

const NODE_MODULES = "node_modules";
const LYVELY_COMMON = "/common/dist";
const CORE_ASSETS = "^src/assets";
const CORE_DIRECTIVES = "^src/directives";
const CORE_REPOSITORY = "^src/repository";
const CORE_ROUTER = "^src/router";
const CORE_STORE = "^src/store";
const CORE_STYLES = "^src/styles";
const CORE_TYPES = "^src/types";
const CORE_UTIL = "^src/util";

const CORE_DEPS = [
  MODULE_CORE,
  CORE_ASSETS,
  CORE_DIRECTIVES,
  CORE_REPOSITORY,
  CORE_ROUTER,
  CORE_STORE,
  CORE_STYLES,
  CORE_TYPES,
  CORE_UTIL,
  LYVELY_COMMON,
  NODE_MODULES,
];

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
    createModuleDeps("accessibility"),
  ],
  options: preset.options,
};
