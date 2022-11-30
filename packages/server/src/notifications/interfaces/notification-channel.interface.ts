import { Notification } from '../schemas';
import { SubscriptionContext } from '@/notifications/services';

export interface NotificationDeliveryResult {
  id: string;
  success: boolean;
  error?: string;
}

export interface INotificationChannel {
  getId(): string;
  send(
    context: SubscriptionContext,
    notification: Notification,
  ): Promise<NotificationDeliveryResult>;
}
