import { IStreamService } from '@/stream';
import { IWebNotification } from '@/notifications';
import { Endpoint } from '@/endpoints';

export type INotificationsService = IStreamService<IWebNotification>;

export type NotificationsEndpoint = Endpoint<INotificationsService>;

export const ENDPOINT_NOTIFICATIONS = 'notifications';
