import { IAppConfigService, IAppConfig } from '@lyvely/interface';
import appConfigRepository from './app-config.repository';

export class AppConfigService implements IAppConfigService {
  async getConfig(): Promise<IAppConfig> {
    const { data: config } = await appConfigRepository.loadConfig();
    return config;
  }
}
