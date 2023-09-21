import { Notification } from '../schemas';

export interface INotificationService {
  send(notification: Notification);
}
