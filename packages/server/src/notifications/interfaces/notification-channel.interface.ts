import { Notification, NotificationChannelDeliveryStatus, UserNotification } from '../schemas';
import { UserSubscriptionContext } from '@/user-subscription';
import { INotificationRateLimit, User } from '@/users';
import { Translatable } from '@/i18n';

export interface INotificationChannel {
  getId(): string;
  getTitle(): Translatable;
  getRateLimit(): INotificationRateLimit;
  send(
    context: UserSubscriptionContext,
    notification: Notification,
  ): Promise<NotificationChannelDeliveryStatus>;

  isActive(user: User): boolean;
}
