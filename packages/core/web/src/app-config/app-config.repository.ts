import { ENDPOINT_APP_CONFIG, IAppConfig, useApiRepository } from '@lyvely/core-interface';

export default {
  async loadConfig() {
    return useApiRepository().get<IAppConfig>(ENDPOINT_APP_CONFIG);
  },
};
