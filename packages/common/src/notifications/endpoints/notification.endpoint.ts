import { IStreamService } from '@/stream';
import { IWebNotification } from '@/notifications';
import { Endpoint } from '@/endpoints';

export interface INotificationsService extends IStreamService<IWebNotification> {}

export type NotificationsEndpoint = Endpoint<INotificationsService>;

export const ENDPOINT_NOTIFICATIONS = 'notifications';
