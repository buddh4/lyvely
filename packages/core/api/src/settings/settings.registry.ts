import { ISetting } from '@lyvely/core-interface';

/**
 * This map is used to register settings in relation to its key.
 */
const registry = new Map<string, ISetting>();

/**
 * Adds a setting entry to the registration. If the setting already exists it will be overwritten.
 * @param settings
 */
export const registerSettings = (settings: ISetting[]) => {
  settings.forEach((setting) => registry.set(setting.key, setting));
};

/**
 * Returns a setting either by providing a setting instance or key. In case a setting object is given we assure this
 * setting is registered.
 * @param settingOrKey
 */
export const getSetting = (settingOrKey: ISetting | string) => {
  const settingKey = typeof settingOrKey === 'string' ? settingOrKey : settingOrKey.key;
  return registry.get(settingKey);
};

/**
 * Cleans up all registered settings, can be used to reset settings in tests.
 */
export const clearSettings = () => {
  registry.clear();
};
