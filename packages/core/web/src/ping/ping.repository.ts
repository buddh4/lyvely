import { useApiRepository } from '@lyvely/core-interface';

export default {
  async ping() {
    return useApiRepository().get<{ ts: number }>('ping');
  },
};
