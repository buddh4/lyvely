import { AbstractDao, BaseEntity } from '@/core';
import { getSetting } from '@/settings/settings.registry';
import {
  EntityNotFoundException,
  FieldValidationException,
  IFieldValidationResult,
} from '@lyvely/common';
import { ISetting } from '@lyvely/core-interface';
import { validateSettingValue } from '@/settings/settings.helper';
import { Logger } from '@nestjs/common';

export abstract class SettingsService<TModel extends BaseEntity<TModel> & { settings: any }> {
  protected abstract logger: Logger;
  protected abstract settingsDao: AbstractDao<TModel>;

  async updateSettings(target: TModel, updates: [{ key: string; value: any }]) {
    const validationErrors: IFieldValidationResult[] = [];
    const updateQuery = updates.reduce((result, update) => {
      const { key, value } = update;
      const setting = getSetting(key);

      if (setting && validateSettingValue(setting, value)) {
        result[`settings.${setting.key}`] = value;
      } else {
        validationErrors.push({ property: key });
      }

      return result;
    }, {} as Record<string, any>);

    if (validationErrors.length) throw new FieldValidationException(validationErrors);

    return this.settingsDao.updateOneSetById(target, updateQuery);
  }

  protected getSetting(settingOrKey: ISetting | string): ISetting | undefined {
    const setting = getSetting(settingOrKey);

    if (!setting) {
      this.logger.warn(`Invalid setting ${settingOrKey}`);
    }

    return setting;
  }
}
