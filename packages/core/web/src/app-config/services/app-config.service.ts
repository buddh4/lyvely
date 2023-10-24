import { IAppConfigService, IAppConfig } from '@lyvely/core-interface';
import appConfigRepository from '../repositories/app-config.repository';

export class AppConfigService implements IAppConfigService {
  async getConfig(): Promise<IAppConfig> {
    const { data: config } = await appConfigRepository.loadConfig();
    return config;
  }
}
