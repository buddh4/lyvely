import {
  ENDPOINT_NOTIFICATIONS,
  INotificationsService,
  IStreamRequest,
  useApiRepository,
} from '@lyvely/core-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async loadTail(request: IStreamRequest) {
    return useApiRepository().post<EndpointResult<INotificationsService['loadTail']>>(
      `${ENDPOINT_NOTIFICATIONS}/load-next`,
      request,
    );
  },

  async loadHead(request: IStreamRequest) {
    return useApiRepository().post<EndpointResult<INotificationsService['loadHead']>>(
      `${ENDPOINT_NOTIFICATIONS}/update`,
      request,
    );
  },

  async markAsSeen(nid: string) {
    return useApiRepository().post<EndpointResult<INotificationsService['markAsSeen']>>(
      `${ENDPOINT_NOTIFICATIONS}/${nid}/mark-as-seen`,
    );
  },

  async loadEntry(nid: string) {
    return useApiRepository().post<EndpointResult<INotificationsService['loadEntry']>>(
      `${ENDPOINT_NOTIFICATIONS}/${nid}`,
    );
  },

  async test() {
    return useApiRepository().post<boolean>(`${ENDPOINT_NOTIFICATIONS}/test`);
  },
};
