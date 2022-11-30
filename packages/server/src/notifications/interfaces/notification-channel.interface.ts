import { User } from '@/users';
import { ProfileRelation } from '@/profiles';
import { Notification } from '../schemas';

export interface NotificationContext {
  user: User;
  profileRelation?: ProfileRelation;
}

export interface NotificationDeliveryResult {
  id: string;
  success: boolean;
  error?: string;
}

export interface INotificationChannel {
  getId(): string;
  send(
    context: NotificationContext,
    notification: Notification,
  ): Promise<NotificationDeliveryResult>;
}
