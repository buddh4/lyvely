import { Translatable } from '@/i18n';

export abstract class NotificationCategory {
  abstract isConfigurable: boolean;

  abstract getId(): string;

  abstract getDefaultPreferences(channel: string): boolean;

  abstract getTitle(): Translatable;

  abstract getDescription(): Translatable;
}