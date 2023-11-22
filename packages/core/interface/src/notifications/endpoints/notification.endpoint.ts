import { IStreamClient, StreamEndpointPaths } from '@/streams';
import { IWebNotification } from '../interfaces';
import { Endpoint } from '@lyvely/common';

export interface INotificationsClient extends IStreamClient<IWebNotification> {
  markAsSeen(nid: string): Promise<void>;
  test(test: string): Promise<boolean>;
}

export type NotificationsEndpoint = Endpoint<INotificationsClient>;

export const ENDPOINT_NOTIFICATIONS = 'notifications';

export const NotificationEndpointPaths = {
  ...StreamEndpointPaths,
  MARK_AS_SEEN: (nid: string) => `${nid}/mark-as-seen`,
  TEST: 'test',
};
