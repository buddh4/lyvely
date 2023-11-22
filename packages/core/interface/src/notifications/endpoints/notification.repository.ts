import { IStreamRequest } from '@/streams';
import {
  ENDPOINT_NOTIFICATIONS,
  INotificationsClient,
  NotificationEndpointPaths,
} from './notification.endpoint';
import { useApi } from '@/repository';

const api = useApi<INotificationsClient>(ENDPOINT_NOTIFICATIONS);

export default {
  async loadTail(request: IStreamRequest) {
    return api.post<'loadTail'>(NotificationEndpointPaths.TAIL, request);
  },

  async loadHead(request: IStreamRequest) {
    return api.post<'loadHead'>(NotificationEndpointPaths.HEAD, request);
  },

  async markAsSeen(nid: string) {
    return api.post<'markAsSeen'>(NotificationEndpointPaths.MARK_AS_SEEN(nid));
  },

  async loadEntry(nid: string) {
    return api.post<'loadEntry'>(nid);
  },

  async test() {
    return api.post<'test'>(NotificationEndpointPaths.TEST);
  },
};
