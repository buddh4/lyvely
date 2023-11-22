import { useApiRepository } from '@lyvely/interface';

export default {
  async ping() {
    return useApiRepository().get<{ ts: number }>('ping');
  },
};
