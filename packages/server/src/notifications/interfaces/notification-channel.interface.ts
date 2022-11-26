import { User } from '@/users';

export interface INotificationChannel {
  getId(): string;
  queue(user: User, notification: Notification);
  send(user: User, notification: Notification);
  sendBulk(users: User[], notification: Notification);
}
