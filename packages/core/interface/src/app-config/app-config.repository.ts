import { ENDPOINT_APP_CONFIG, IAppConfigClient } from './app-config.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';

export const appConfigRepository = useApi<IAppConfigClient>(ENDPOINT_APP_CONFIG);

export default {
  async getConfig(options?: IProfileApiRequestOptions) {
    return appConfigRepository.get<'getConfig'>(options);
  },
};
