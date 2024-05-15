import { Translatable } from '@/i18n';
import { INotificationCategory, INotificationCategorySettings } from '../interfaces';
import { NotificationCategory } from '../decorators';

@NotificationCategory()
export class DefaultNotificationCategory implements INotificationCategory {
  getId() {
    return 'default';
  }

  getDefaultPreferences(): boolean {
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

  getSettings(): INotificationCategorySettings {
    return {};
  }
}
