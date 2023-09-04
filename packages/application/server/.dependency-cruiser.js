/** @type {import('dependency-cruiser').IConfiguration} */

const preset = require('../../.dependency-cruiser.preset');

function getModulePath(name) {
  return `^src/${name}[^-]`;
}

const MODULE_AUTH = getModulePath('auth');
const MODULE_APP_CONFIG = getModulePath('app-config');
const MODULE_ACTIVITIES = getModulePath('activities');
const MODULE_CAPTCHA = getModulePath('captcha');
const MODULE_CORE = getModulePath('core');
const MODULE_CONTENT = getModulePath('content');
const MODULE_CALENDAR = getModulePath('calendar');
const MODULE_FEATURES = getModulePath('features');
const MODULE_FILES = getModulePath('files');
const MODULE_I18N = getModulePath('i18n');
const MODULE_JWT = getModulePath('jwt');
const MODULE_POLICIES = getModulePath('policies');
const MODULE_PERMISSIONS = getModulePath('permissions');
const MODULE_PROFILES = getModulePath('profiles');
const MODULE_STREAM = getModulePath('stream');
const MODULE_THROTTLER = getModulePath('throttler');
const MODULE_LIVE = getModulePath('live');
const MODULE_MAILS = getModulePath('mail');
const MODULE_NOTIFICATIONS = getModulePath('notifications');
const MODULE_TEST = getModulePath('test');
const MODULE_USERS = getModulePath('users');
const MODULE_USER_SUBSCRIPTION = getModulePath('user-subscription');
const MODULE_USER_OTP = getModulePath('user-otp');
const MODULE_TAGS = getModulePath('tags');
const MODULE_TIME_SERIES = getModulePath('time-series');
const MODULE_QUEUE = getModulePath('queue');
const NODE_MODULES = 'node_modules';
const LYVELY_COMMON = '/common/dist';
const NODE_CORE = '^((?!\\/).)*$';

const CORE_DEPS = [MODULE_CORE, MODULE_TEST, LYVELY_COMMON, NODE_MODULES, NODE_CORE];

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
    createModuleDeps('account', [MODULE_USERS, MODULE_USER_OTP, MODULE_MAILS]),
    createModuleDeps('activities', [
      MODULE_POLICIES,
      MODULE_CONTENT,
      MODULE_CALENDAR,
      MODULE_USERS,
      MODULE_PROFILES,
      MODULE_TAGS,
      MODULE_TIME_SERIES,
      MODULE_MAILS,
    ]),
    createModuleDeps('app-config', [MODULE_I18N]),
    createModuleDeps('auth', [MODULE_USERS, MODULE_JWT, MODULE_MAILS, MODULE_THROTTLER, MODULE_CAPTCHA]),
    createModuleDeps('avatars', [MODULE_FILES]),
    createModuleDeps('calendar'),
    createModuleDeps('captcha'),
    createModuleDeps('content', [
      MODULE_PROFILES,
      MODULE_USERS,
      MODULE_POLICIES,
      MODULE_TAGS,
      MODULE_LIVE,
    ]),
    createModuleDeps('core'),
    createModuleDeps('content-stream', [MODULE_STREAM, MODULE_PROFILES, MODULE_CONTENT]),
    createModuleDeps('files'),
    createModuleDeps('i18n', [MODULE_USERS]),
    createModuleDeps('journals'),
    createModuleDeps('jwt', [MODULE_USERS]),
    createModuleDeps('live', [MODULE_USERS, MODULE_PROFILES]),
    createModuleDeps('mails'),
    createModuleDeps('notifications', [
      MODULE_I18N,
      MODULE_USERS,
      MODULE_PROFILES,
      MODULE_STREAM,
      MODULE_LIVE,
      MODULE_USER_SUBSCRIPTION,
        MODULE_MAILS
    ]),
    createModuleDeps('permissions'),
    createModuleDeps('policies'),
    createModuleDeps('profiles', [
      MODULE_USERS,
      MODULE_PERMISSIONS,
      MODULE_MAILS,
      MODULE_POLICIES,
      MODULE_CALENDAR,
      MODULE_TAGS,
    ]),
    createModuleDeps('statistics', [MODULE_USERS]),
    createModuleDeps('tags', [MODULE_PROFILES, MODULE_POLICIES]),
    createModuleDeps('test', [
      MODULE_USERS,
      MODULE_PROFILES,
      MODULE_POLICIES,
      MODULE_MAILS,
      MODULE_CONTENT,
      MODULE_I18N,
      MODULE_APP_CONFIG,
      MODULE_NOTIFICATIONS,
      MODULE_LIVE,
      MODULE_FEATURES,
    ]),
    createModuleDeps('throttler'),
    createModuleDeps('time-series', [MODULE_CALENDAR, MODULE_CONTENT, MODULE_USERS, MODULE_PROFILES]),
    createModuleDeps('types'),
    createModuleDeps('user-invites', [
      MODULE_USERS,
      MODULE_PROFILES,
      MODULE_POLICIES,
      MODULE_MAILS,
    ]),
    createModuleDeps('user-otp', [MODULE_USERS]),
    createModuleDeps('user-permissions', [MODULE_USERS, MODULE_PERMISSIONS]),
    createModuleDeps('user-subscription', [MODULE_USERS, MODULE_PROFILES]),
    createModuleDeps('user-registration', [
      MODULE_USERS,
      MODULE_AUTH,
      MODULE_PROFILES,
      MODULE_MAILS,
      MODULE_USER_OTP,
    ]),
    createModuleDeps('users', [MODULE_POLICIES, MODULE_FEATURES, MODULE_THROTTLER]),
    /* rules from the 'recommended' preset: */
  ],
  options: preset.options,
};
