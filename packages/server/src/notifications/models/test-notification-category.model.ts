import { Translatable } from '@/i18n';
import { NotificationCategory } from '@/notifications/models/notification-category.model';

export class TestNotificationCategory extends NotificationCategory {
  static ID = 'test';

  getId() {
    return TestNotificationCategory.ID;
  }

  getDefaultPreferences(channel: string): boolean {
    return true;
  }

  getTitle(): Translatable {
    return {
      key: 'notifications.categories.test.title',
    };
  }

  getDescription(): Translatable {
    return {
      key: 'notifications.categories.test.description',
    };
  }
}
