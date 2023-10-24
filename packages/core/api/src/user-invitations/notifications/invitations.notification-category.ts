import { Translatable } from '@/i18n';
import {
  INotificationCategory,
  INotificationCategorySettings,
  NotificationCategory,
} from '@/notifications';

@NotificationCategory()
export class InvitationsNotificationCategory implements INotificationCategory {
  static ID = 'invitations';

  getId() {
    return InvitationsNotificationCategory.ID;
  }

  getDefaultPreferences(channel: string): boolean {
    return true;
  }

  getTitle(): Translatable {
    return {
      key: 'invitations.notifications.category.title',
    };
  }

  getDescription(): Translatable {
    return {
      key: 'invitations.notifications.category.description',
    };
  }

  getSettings(): INotificationCategorySettings {
    return {
      isConfigurable: true,
    };
  }
}
