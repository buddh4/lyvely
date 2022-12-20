import repository from '@/repository';
import {
  ENDPOINT_NOTIFICATIONS,
  EndpointResult,
  INotificationsService,
  IStreamRequest,
} from '@lyvely/common';

export default {
  async loadNext(request: IStreamRequest) {
    return repository.post<EndpointResult<INotificationsService['loadNext']>>(
      `${ENDPOINT_NOTIFICATIONS}/load-next`,
      request,
    );
  },

  async update(request: IStreamRequest) {
    return repository.post<EndpointResult<INotificationsService['update']>>(
      `${ENDPOINT_NOTIFICATIONS}/update`,
      request,
    );
  },

  async markAsSeen(nid: string) {
    return repository.post<EndpointResult<INotificationsService['markAsSeen']>>(
      `${ENDPOINT_NOTIFICATIONS}/${nid}/mark-as-seen`,
    );
  },

  async loadEntry(nid: string) {
    return repository.get<EndpointResult<INotificationsService['loadEntry']>>(
      `${ENDPOINT_NOTIFICATIONS}/${nid}`,
    );
  },

  async test() {
    return repository.post<boolean>(`${ENDPOINT_NOTIFICATIONS}/test`);
  },
};
