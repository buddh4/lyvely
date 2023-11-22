import { ENDPOINT_APP_CONFIG, IAppConfigClient } from './app-config.endpoint';
import { useApi } from '@/repository';

export const appConfigRepository = useApi<IAppConfigClient>(ENDPOINT_APP_CONFIG);

export default {
  async getConfig() {
    return appConfigRepository.get<'getConfig'>();
  },
};
