import { Translatable } from '@/i18n';
import { INotificationCategory, INotificationCategorySettings } from '../interfaces';
import { NotificationCategory } from '../decorators';

@NotificationCategory()
export class TestNotificationCategory implements INotificationCategory {
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

  getSettings(): INotificationCategorySettings {
    return {
      isConfigurable: false,
    };
  }
}
