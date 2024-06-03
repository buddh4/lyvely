import { HelmetOptions } from 'helmet';
import { MailerOptions } from '@nestjs-modules/mailer';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { GenericObject, NestedPaths, TypeFromPath } from '@lyvely/common';
import { Request, Response } from 'express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ServerOptions } from 'https';
import { MongooseModuleOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';
import { IFeatureConfig, GlobalPermissionRole, IPermissionConfig } from '@lyvely/interface';
import type { IStorageProviderDefinition, ILocalStorageProviderOptions } from '@/files/interfaces';
import type { RedisOptions } from 'ioredis/built/redis/RedisOptions';

export type LyvelyMailOptions = MailerOptions & {
  createMessageFiles?: boolean;
  messagesPath?: string;
  footerText?: string;
  footerSubtext?: string;
};

export type CompressionOptions = {
  chunkSize?: number;
  filter?: (req: Request, res: Response) => boolean;
  level?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  memLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  strategy?: number;
  threshold?: number;
  windowBits?: number;
};

export type LyvelyHttpOptions = {
  appUrl?: string;
  compression?: CompressionOptions | boolean;
  baseUrl: string;
  host: string;
  port: number;
  cors?: CorsOptions;
  tls?: ServerOptions;
  trustProxy?: boolean | string | number | ((ip: string) => boolean);
  rateLimit?: {
    ttl: number;
    limit: number;
  };
};

export interface ILyvelyMongoDBOptions extends MongooseModuleOptions {
  uri: string;
  debug?: boolean;
  replicaSet?: string;
  transactions?: boolean;
}

export type I18NOptions = {
  defaultLocale?: string;
  locales: string[];
};

export type CookieSameSite = 'lax' | 'strict' | 'none';

export type LyvelyAuthOptions = {
  jwt: {
    'secure-cookies': boolean;
    issuer?: string;
    access: {
      secret: string;
      expiresIn: string;
      sameSite: CookieSameSite;
    };
    refresh: {
      secret: string;
      expiresIn: string;
      expiresInRemember: string;
      sameSite: CookieSameSite;
    };
    verify: {
      secret: string;
      expiresIn: string;
    };
  };
};

export interface IStorageBucketDefinition {
  name: string;
  storage: string;
}

export interface IStorageConfig {
  default?: string;
  providers?: IStorageProviderDefinition[];
  buckets?: IStorageBucketDefinition[];
  local?: ILocalStorageProviderOptions;
}

export type LyvelyFileOptions = {
  storage?: IStorageConfig;
  upload?: {
    /** Used for file uploads, this should be a temporary folder (Default: storage.local.dest/tmp) **/
    dest?: string;
    limits?: {
      /** For multipart forms, the max file size (in bytes)(Default: Infinity) */
      fileSize?: number;
    };
  };
};

export type GlobalUserPermissionRoleConfiguration = Record<string, GlobalPermissionRole>;

export interface ILyvelyCsrfOptions {
  enabled?: boolean;
  name?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: CookieSameSite;
}

export interface IUserInviteOptions {
  maxPerWeek?: number;
}

export type IRegistrationModes = 'public' | 'invite' | 'none';

export interface IUserRegistrationOptions {
  mode?: IRegistrationModes;
}

export interface ILegalOptions {
  poweredBy?: boolean;
  sections: {
    [k: string]: {
      label: string;
      content?: string;
      url?: string;
      version: string;
      format?: 'html' | 'markdown';
      locales?: {
        [k: string]: {
          label: string;
          content?: string;
          url?: string;
          version: string;
          format?: 'html' | 'markdown';
        };
      };
    };
  };
}

export enum OperationMode {
  STANDALONE = 'standalone',
  // STANDALONE_CLUSTER = 'standalone-cluster',
  // DISTRIBUTED = 'distributed',
}

export type ServerConfiguration<ModuleView = Record<string, unknown>> = {
  appName: string;
  operationMode: 'standalone' | 'standalone-cluster' | 'distributed';
  docUrl?: string;
  redis: RedisOptions;
  csrf?: ILyvelyCsrfOptions;
  contactMail: string;
  i18n?: I18NOptions;
  http?: LyvelyHttpOptions;
  mongodb?: ILyvelyMongoDBOptions;
  auth?: LyvelyAuthOptions;
  helmet?: HelmetOptions | false;
  files?: LyvelyFileOptions;
  mail?: LyvelyMailOptions;
  features?: IFeatureConfig;
  permissions?: IPermissionConfig;
  userRoles?: GlobalUserPermissionRoleConfiguration;
  modules?: ModuleView;
  legal?: ILegalOptions;
  invitations?: IUserInviteOptions;
  userRegistration?: IUserRegistrationOptions;
  serveStatic?: ServeStaticModuleOptions;
};

export type ConfigurationPath<C = ServerConfiguration> = {
  [key in NestedPaths<C>]: TypeFromPath<GenericObject<C>, key>;
} & any;
