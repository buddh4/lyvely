import { repository } from '@/core';
import { IAppConfig } from '@lyvely/core-interface';

// TODO: change to config endpoint
const resource = 'app-config';

export default {
  async loadConfig() {
    return repository.get<IAppConfig>(`${resource}`);
  },
};
