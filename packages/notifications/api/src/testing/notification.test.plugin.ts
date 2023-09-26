import { TestPlugin } from '@lyvely/testing';
import { NotificationsModule } from '../notifications.module';
import { I18nModule } from '@lyvely/i18n';

export const notificationTestPlugin = () => {
  return {
    apply(builder) {
      builder.imports([NotificationsModule, I18nModule]);
    },
  } as TestPlugin;
};
