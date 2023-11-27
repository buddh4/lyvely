import { StrictEndpoint } from '@/endpoints';
import { IAppConfig } from './app-config.interface';

export interface IAppConfigClient {
  getConfig(): Promise<IAppConfig>;
}

export type AppConfigEndpoint = StrictEndpoint<IAppConfigClient>;
export const ENDPOINT_APP_CONFIG = 'app-config';
