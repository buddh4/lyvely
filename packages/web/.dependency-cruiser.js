/** @type {import('dependency-cruiser').IConfiguration} */

const preset = require("../../.dependency-cruiser.preset");

function getModulePath(name) {
  return `^src/modules/${name}`;
}

const MODULE_AUTH = getModulePath("auth");
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
const MODULE_APP_CONFIG = getModulePath("app-config");
const MODULE_I18N = getModulePath("i18n");

const NODE_MODULES = "node_modules";
const LYVELY_COMMON = "/common/dist";
const CORE_ASSETS = "^src/assets";
const CORE_REPOSITORY = "^src/repositories";
const CORE_ROUTER = "^src/router";
const CORE_STORE = "^src/store";
const CORE_UTIL = "^src/util";
const CORE_I18N = "^src/i18n.ts";

const CORE_DEPS = [
  MODULE_CORE,
  CORE_ASSETS,
  CORE_REPOSITORY,
  CORE_ROUTER,
  CORE_STORE,
  CORE_UTIL,
  MODULE_UI,
  CORE_I18N,
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
    createModuleDeps("activities", [
      MODULE_CALENDAR,
      MODULE_PROFILES,
      MODULE_COMMON,
      MODULE_ACCESSIBILITY,
    ]),
    createModuleDeps("app-config"),
    createModuleDeps("auth", [MODULE_APP_CONFIG, MODULE_I18N]),
    createModuleDeps("calendar", [MODULE_PROFILES, MODULE_AUTH, MODULE_TAGS]),
    createModuleDeps("common"),
    createModuleDeps("content"),
    createModuleDeps("core"),
    createModuleDeps("i18n", [MODULE_AUTH, MODULE_APP_CONFIG]),
    createModuleDeps("journals"),
    createModuleDeps("profiles", [MODULE_USERS, MODULE_AUTH]),
    createModuleDeps("statistics"),
    createModuleDeps("tags", [MODULE_PROFILES, MODULE_COMMON]),
    createModuleDeps("ui", [MODULE_ACCESSIBILITY]),
    createModuleDeps("user-registration", [MODULE_I18N, MODULE_AUTH]),
    createModuleDeps("users", [MODULE_AUTH]),
  ],
  options: preset.options,
};
