import { Notification, NotificationChannelDeliveryStatus, UserNotification } from '../schemas';
import { UserSubscriptionContext } from '@lyvely/subscription';
import { INotificationRateLimit, User } from '@lyvely/users';
import { Translatable } from '@lyvely/i18n';

export interface INotificationChannel {
  getId(): string;
  getTitle(): Translatable;
  getRateLimit(): INotificationRateLimit;
  send(
    context: UserSubscriptionContext,
    notification: Notification,
    userNotification: UserNotification,
  ): Promise<NotificationChannelDeliveryStatus>;

  isActive(user: User): boolean;
}
