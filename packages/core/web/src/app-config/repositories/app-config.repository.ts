import { repository } from '@/core';
import { ENDPOINT_APP_CONFIG, IAppConfig } from '@lyvely/core-interface';

export default {
  async loadConfig() {
    return repository.get<IAppConfig>(ENDPOINT_APP_CONFIG);
  },
};
