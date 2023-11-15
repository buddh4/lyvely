import { ISetting } from '@lyvely/core-interface';

export class SettingsRegistry {
  /**
   * This map is used to register settings in relation to its key.
   */
  registry = new Map<string, ISetting>();

  /**
   * Adds a setting entry to the registration. If the setting already exists it will be overwritten.
   * @param settings
   */
  registerSettings(settings: ISetting[]) {
    settings.forEach((setting) => this.registry.set(setting.key, setting));
  }

  /**
   * This map is used to register settings in relation to its key.
   */
  getSetting(settingOrKey: ISetting | string) {
    const settingKey = typeof settingOrKey === 'string' ? settingOrKey : settingOrKey.key;
    return this.registry.get(settingKey);
  }

  /**
   * Cleans up all registered settings, can be used to reset settings in tests.
   */
  clearSettings = () => {
    this.registry.clear();
  };
}
