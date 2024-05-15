import { AbstractDao, BaseDocument, DocumentIdentity } from '@/core';
import { SettingsRegistry } from '@/settings/settings.registry';
import { FieldValidationException, ISetting } from '@lyvely/interface';
import { IFieldValidationResult } from '@lyvely/common';
import { Logger } from '@nestjs/common';
import { ISettingUpdate } from '@/settings/settings.interface';
import { isBoolean, isDefined, isNumber, isString } from 'class-validator';

export abstract class SettingsService<TModel extends BaseDocument & { settings: any }> {
  protected abstract logger: Logger;
  protected abstract settingsDao: AbstractDao<TModel>;
  protected abstract settingsRegistry: SettingsRegistry;

  async updateSettings(target: DocumentIdentity<TModel>, updates: ISettingUpdate) {
    const validationErrors: IFieldValidationResult[] = [];
    if (!updates.length) return true;

    const updateQuery = updates.reduce(
      (result, update) => {
        const { key, value } = update;
        const setting = this.settingsRegistry.getSetting(key);

        if (isDefined(setting) && this.validateSettingValue(setting!, value)) {
          result[`settings.${setting!.key}`] = value;
        } else {
          validationErrors.push({ property: key });
        }

        return result;
      },
      {} as Record<string, any>,
    );

    if (validationErrors.length) throw new FieldValidationException(validationErrors);

    return this.settingsDao.updateOneSetById(target, updateQuery);
  }

  protected validateSettingValue(settingOrKey: ISetting | string, value: any): boolean {
    const setting = this.getSetting(settingOrKey);
    if (typeof setting === 'undefined') return false;

    if (setting.type === String && !isString(value)) return false;
    if (setting.type === Boolean && !isBoolean(value)) return false;
    if (setting.type === Number && !isNumber(value)) return false;

    if (setting.validator && !setting.validator(value)) return false;

    return !setting.validator || setting.validator(value);
  }

  protected getSetting(settingOrKey: ISetting | string): ISetting | undefined {
    const setting = this.settingsRegistry.getSetting(settingOrKey);

    if (!setting) {
      this.logger.warn(`Invalid setting ${settingOrKey}`);
    }

    return setting;
  }
}
