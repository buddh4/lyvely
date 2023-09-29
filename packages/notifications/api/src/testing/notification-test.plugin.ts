import { TestPlugin } from '@lyvely/testing';
import { NotificationsModule } from '../notifications.module';
import { I18nModule, i18nTestPlugin } from '@lyvely/i18n';
import { mailTestPlugin } from '@lyvely/mails';

export const notificationTestPlugin = {
  apply(builder) {
    builder.imports([NotificationsModule, I18nModule]).plugins([i18nTestPlugin, mailTestPlugin]);
  },
} as TestPlugin;
