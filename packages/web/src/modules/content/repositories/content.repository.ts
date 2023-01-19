import repository from '@/repository';
import { ENDPOINT_CONTENT } from '@lyvely/common';

export default {
  archive(cid: string) {
    return repository.post(`${ENDPOINT_CONTENT}/${cid}/archive`);
  },

  unarchive(cid: string) {
    return repository.post(`${ENDPOINT_CONTENT}/${cid}/unarchive`);
  },
};
