import { Translatable } from '@/i18n';
import { NotificationCategory } from '@/notifications/models/notification-category.model';

export class DefaultNotificationCategory extends NotificationCategory {
  getId() {
    return 'default';
  }

  getDefaultPreferences(channel: string): boolean {
    return true;
  }

  getTitle(): Translatable {
    return {
      key: 'notifications.categories.default.title',
    };
  }

  getDescription(): Translatable {
    return {
      key: 'notifications.categories.default.description',
    };
  }
}
