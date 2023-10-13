import { StrictEndpoint } from '@lyvely/common';
import { IAppConfig } from './app-config.interface';

export interface IAppConfigService {
  getConfig(): Promise<IAppConfig>;
}

export type AppConfigEndpoint = StrictEndpoint<IAppConfigService>;
export const ENDPOINT_APP_CONFIG = 'app-config';
