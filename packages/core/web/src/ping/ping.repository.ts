import { repository } from '@/core';

export default {
  async ping() {
    return repository.get<{ ts: number }>('ping');
  },
};
