import { IStreamClient, StreamEndpoints } from '@/streams';
import { IWebNotification } from '../interfaces';
import { Endpoint } from '@/endpoints';

export interface INotificationsClient extends IStreamClient<IWebNotification> {
  markAsSeen(nid: string): Promise<void>;
  test(test: string): Promise<boolean>;
}

export type NotificationsEndpoint = Endpoint<INotificationsClient>;

export const API_NOTIFICATIONS = 'notifications';

export const NotificationEndpoints = {
  ...StreamEndpoints,
  MARK_AS_SEEN: (nid: string) => `${nid}/mark-as-seen`,
  TEST: 'test',
};
