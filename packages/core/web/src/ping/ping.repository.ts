import { repository } from '@/core/repository';

export default {
  async ping() {
    return repository.get<{ ts: number }>('ping');
  },
};
