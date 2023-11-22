import { useSingleton } from '@lyvely/common';
import appConfigRepository from './app-config.repository';
import { IAppConfigClient } from './app-config.endpoint';
import { unwrapResponse } from '@/endpoints';
import { IAppConfig } from './app-config.interface';

export class AppConfigClient implements IAppConfigClient {
  async getConfig(): Promise<IAppConfig> {
    return unwrapResponse(appConfigRepository.getConfig());
  }
}

export const useAppConfigClient = useSingleton(() => new AppConfigClient());
