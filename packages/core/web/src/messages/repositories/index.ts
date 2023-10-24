import { repository } from '@/core';
import { ENDPOINT_MESSAGE, CreateMessageModel, IMessageClient } from '@lyvely/core-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  create(model: CreateMessageModel) {
    return repository.post<EndpointResult<IMessageClient['create']>>(`${ENDPOINT_MESSAGE}`, model);
  },

  update(id: string, model: Partial<CreateMessageModel>) {
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
