import type { HelmetOptions } from 'helmet';
import type { ServeStaticModuleOptions } from '@nestjs/serve-static';
import type { IFeatureConfig } from '@lyvely/interface';
import type { RedisOptions } from 'ioredis/built/redis/RedisOptions';
import type { I18NOptions } from './i18n-options.interface';
import type { ICsrfOptions } from './csrf-options.interface';
import type { IHttpOptions } from './http-options.interface';
import type { IMongoDBOptions } from './mongodb-options.interface';
import type { IMailOptions } from './mail-options.interface';
import type { ITenancyOptions } from '../tenancy/tenancy-options.interface';

export enum OperationMode {
  STANDALONE = 'standalone',
  // STANDALONE_CLUSTER = 'standalone-cluster',
  // DISTRIBUTED = 'distributed',
}

export type ServerConfiguration<ModuleView extends Record<string, any> = {}> = {
  appName: string;
  operationMode: 'standalone' | 'standalone-cluster' | 'distributed';
  redis: RedisOptions;
  contactMail: string;
  http: IHttpOptions;
  mongodb: IMongoDBOptions;
  i18n?: I18NOptions;
  helmet?: HelmetOptions | false;
  csrf?: ICsrfOptions;
  docUrl?: string;
  mail?: IMailOptions;
  features?: IFeatureConfig;
  tenancy?: ITenancyOptions;
  modules?: ModuleView;
  serveStatic?: ServeStaticModuleOptions;
};

export type ModuleConfig<K extends string, T> = Record<K, T>;
