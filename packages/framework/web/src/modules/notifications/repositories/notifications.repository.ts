import repository from '@/repository';
import { ENDPOINT_NOTIFICATIONS, INotificationsService } from '@lyvely/notifications-interface';
import { IStreamRequest } from '@lyvely/streams-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async loadTail(request: IStreamRequest) {
    return repository.post<EndpointResult<INotificationsService['loadTail']>>(
      `${ENDPOINT_NOTIFICATIONS}/load-next`,
      request,
    );
  },

  async loadHead(request: IStreamRequest) {
    return repository.post<EndpointResult<INotificationsService['loadHead']>>(
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
    return repository.post<EndpointResult<INotificationsService['loadEntry']>>(
      `${ENDPOINT_NOTIFICATIONS}/${nid}`,
    );
  },

  async test() {
    return repository.post<boolean>(`${ENDPOINT_NOTIFICATIONS}/test`);
  },
};
