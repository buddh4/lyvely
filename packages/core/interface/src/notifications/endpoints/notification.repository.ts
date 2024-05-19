import { IStreamRequest } from '@/streams';
import {
  API_NOTIFICATIONS,
  INotificationsClient,
  NotificationEndpoints,
} from './notification.endpoint';
import { useApi } from '@/repository';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

const api = useApi<INotificationsClient>(API_NOTIFICATIONS);

export default {
  async loadTail(request: IStreamRequest) {
    return api.post<'loadTail'>(NotificationEndpoints.TAIL, request);
  },

  async loadHead(request: IStreamRequest) {
    return api.post<'loadHead'>(NotificationEndpoints.HEAD, request);
  },

  async markAsSeen(nid: string) {
    return api.post<'markAsSeen'>(NotificationEndpoints.MARK_AS_SEEN(nid));
  },

  async loadEntry(nid: string) {
    return api.post<'loadEntry'>(nid);
  },

  async test() {
    return api.post<'test'>(NotificationEndpoints.TEST);
  },
};
