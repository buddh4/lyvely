import { IAppConfigService, AppConfig } from '@lyvely/common';
import appConfigRepository from '../repositories/app-config.repository';

export class AppConfigService implements IAppConfigService {
  async getConfig(): Promise<AppConfig> {
    const { data: config } = await appConfigRepository.loadConfig();
    return config;
  }
}
