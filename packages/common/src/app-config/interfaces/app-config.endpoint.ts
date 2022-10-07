import { StrictEndPoint } from '@/endpoints';
import { AppConfig } from './app-config.type';

export interface IAppConfigService {
  getConfig(): Promise<AppConfig>;
}

export type AppConfigEndpoint = StrictEndPoint<IAppConfigService>;
export const ENDPOINT_APP_CONFIG = 'app-config';
