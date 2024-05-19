import { API_APP_CONFIG, IAppConfigClient } from './app-config.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

export const appConfigRepository = useApi<IAppConfigClient>(API_APP_CONFIG);

export default {
  async getConfig(options?: IProfileApiRequestOptions) {
    return appConfigRepository.get<'getConfig'>(options);
  },
};
