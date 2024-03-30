import { HelmetOptions } from 'helmet';
import { MailerOptions } from '@nestjs-modules/mailer';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { NestedPaths, TypeFromPath } from '@lyvely/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request, Response } from 'express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ServerOptions } from 'https';
import { MongooseModuleOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';
import { IFeatureConfig, GlobalPermissionRole, IPermissionConfig } from '@lyvely/interface';

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

export type LyvelyFileOptions = {
  upload?: MulterOptions;
  local?: {
    path?: string;
  };
};

export type GlobalUserPermissionRoleConfiguration = Record<string, GlobalPermissionRole>;

export type ModulesConfiguration = {} & { [k: string]: object };

export interface IRedisConfig {
  host: string;
  port: number;
}

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
  redis: IRedisConfig;
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

// TODO: This is not working for some types

export type ConfigurationPath<C = ServerConfiguration> = {
  // @ts-ignore
  [key in NestedPaths<C>]: TypeFromPath<C, key>;
} & any;
