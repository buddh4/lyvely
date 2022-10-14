import { StrictEndpoint } from '@/endpoints';
import { AppConfig } from './app-config.type';

export interface IAppConfigService {
  getConfig(): Promise<AppConfig>;
}

export type AppConfigEndpoint = StrictEndpoint<IAppConfigService>;
export const ENDPOINT_APP_CONFIG = 'app-config';
