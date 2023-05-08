import { HelmetOptions } from 'helmet';
import { MailerOptions } from '@nestjs-modules/mailer';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { NestedPaths, TypeFromPath } from '@lyvely/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request, Response } from 'express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import https from 'https';
import { MongooseModuleOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';

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
  tls?: https.ServerOptions;
  trustProxy?: boolean | string | number | ((ip: string) => boolean);
  rateLimit?: {
    ttl: number;
    limit: number;
  };
};

export interface LyvelyMongoDBOptions extends MongooseModuleOptions {
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

export type UserPermissionOptions = Record<string, string[]>;

export type ModulesConfiguration = {} & { [k: string]: object };

export enum OperationMode {
  STANDALONE = 'standalone',
  STANDALONE_CLUSTER = 'standalone-cluster',
  DISTRIBUTED = 'distributed',
}

export interface RedisConfig {
  host: string;
  port: number;
}

export interface LyvelyCsrfOptions {
  name?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: CookieSameSite;
}

export interface UserInviteOptions {
  maxPerWeek?: number;
}

export type RegistrationModes = 'public' | 'invite' | 'none';

export interface UserRegistrationOptions {
  mode?: RegistrationModes;
}

export type LyvelyAppConfiguration = {
  appName: string;
  operationMode: OperationMode;
  docUrl?: string;
  redis: RedisConfig;
  csrf?: LyvelyCsrfOptions;
  contactMail: string;
  i18n?: I18NOptions;
  http?: LyvelyHttpOptions;
  mongodb?: LyvelyMongoDBOptions;
  auth?: LyvelyAuthOptions;
  helmet?: HelmetOptions | false;
  file?: LyvelyFileOptions;
  mail?: LyvelyMailOptions;
  modules?: ModulesConfiguration;
  'user-permissions'?: UserPermissionOptions;
  invitations?: UserInviteOptions;
  userRegistration?: UserRegistrationOptions;
  serveStatic?: ServeStaticModuleOptions;
};

// TODO: This is not working for some types
export type ConfigurationPath = {
  [key in NestedPaths<LyvelyAppConfiguration>]: TypeFromPath<LyvelyAppConfiguration, key>;
} & any;
