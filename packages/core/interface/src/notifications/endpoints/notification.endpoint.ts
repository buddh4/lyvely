import { IStreamClient } from '@/streams';
import { IWebNotification } from '../interfaces';
import { Endpoint } from '@lyvely/common';

export interface INotificationsService extends IStreamClient<IWebNotification> {
  markAsSeen(nid: string): Promise<void>;
}

export type NotificationsEndpoint = Endpoint<INotificationsService>;

export const ENDPOINT_NOTIFICATIONS = 'notifications';
