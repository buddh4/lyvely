import repository from '@/repository';
import { ENDPOINT_MESSAGE, CreateMessage } from '@lyvely/common';

export default {
  create(model: CreateMessage) {
    return repository.post(`${ENDPOINT_MESSAGE}`, model);
  },

  archive(messageId: string) {
    return repository.post(`${ENDPOINT_MESSAGE}/${messageId}/archive`);
  },

  unarchive(messageId: string) {
    return repository.post(`${ENDPOINT_MESSAGE}/${messageId}/unarchive`);
  },
};
