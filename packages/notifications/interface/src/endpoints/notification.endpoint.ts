import { IStreamService } from '@lyvely/streams';
import { IWebNotification } from '../interfaces';
import { Endpoint } from '@lyvely/common';

export interface INotificationsService extends IStreamService<IWebNotification> {
  markAsSeen(nid: string): Promise<void>;
}

export type NotificationsEndpoint = Endpoint<INotificationsService>;

export const ENDPOINT_NOTIFICATIONS = 'notifications';
