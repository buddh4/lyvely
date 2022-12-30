import repository from '@/repository';
import { ENDPOINT_MESSAGE, CreateMessage, EndpointResult, IMessageClient } from '@lyvely/common';

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
    return repository.post<EndpointResult<IMessageClient['archive']>>(
      `${ENDPOINT_MESSAGE}/${messageId}/archive`,
    );
  },

  unarchive(messageId: string) {
    return repository.post<EndpointResult<IMessageClient['unarchive']>>(
      `${ENDPOINT_MESSAGE}/${messageId}/unarchive`,
    );
  },
};
