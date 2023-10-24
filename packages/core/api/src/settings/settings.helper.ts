import { ISetting } from '@lyvely/core-interface';
import { isBoolean, isNumber, isString } from 'class-validator';
import { getSetting } from '@/settings/settings.registry';

export const validateSettingValue = (settingOrKey: ISetting | string, value: any): boolean => {
  const setting = getSetting(settingOrKey);
  if (!setting) return false;

  if (setting.type === String && !isString(value)) return false;
  if (setting.type === Boolean && !isBoolean(value)) return false;
  if (setting.type === Number && !isNumber(value)) return false;

  if (setting.validator && !setting.validator(value)) return false;

  return !setting.validator || setting.validator(value);
};
