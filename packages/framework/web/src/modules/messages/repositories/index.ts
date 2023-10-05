import repository from '@/repository';
import { ENDPOINT_MESSAGE, CreateMessage, IMessageClient } from '@lyvely/messages-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  create(model: CreateMessage) {
    return repository.post<EndpointResult<IMessageClient['create']>>(`${ENDPOINT_MESSAGE}`, model);
  },

  update(id: string, model: Partial<CreateMessage>) {
    return repository.put<EndpointResult<IMessageClient['update']>>(
      `${ENDPOINT_MESSAGE}/${id}`,
      model,
    );
  },

  archive(messageId: string) {
    return repository.post<EndpointResult<any>>(`${ENDPOINT_MESSAGE}/${messageId}/archive`);
  },

  unarchive(messageId: string) {
    return repository.post<EndpointResult<any>>(`${ENDPOINT_MESSAGE}/${messageId}/unarchive`);
  },
};
