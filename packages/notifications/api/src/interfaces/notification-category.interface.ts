import { Translatable } from '@lyvely/i18n';

export interface INotificationCategorySettings {
  isConfigurable?: boolean;
}

export interface INotificationCategory {
  getSettings(): INotificationCategorySettings;

  getId(): string;

  getDefaultPreferences(channel: string): boolean;

  getTitle(): Translatable;

  getDescription(): Translatable;
}
