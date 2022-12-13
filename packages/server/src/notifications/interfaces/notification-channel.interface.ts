import { Notification, NotificationChannelDeliveryStatus } from '../schemas';
import { UserSubscriptionContext } from './user-subscription-context.interface';
import { INotificationRateLimit, User } from '@/users';

export interface INotificationChannel {
  getId(): string;
  getRateLimit(): INotificationRateLimit;
  send(
    context: UserSubscriptionContext,
    notification: Notification,
  ): Promise<NotificationChannelDeliveryStatus>;

  isActive(user: User): boolean;
}
