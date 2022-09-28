import { HelmetOptions } from 'helmet';
import { MailerOptions } from '@nestjs-modules/mailer';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { NestedPaths, TypeFromPath } from '@lyvely/common';

export type LyvelyMailOptions = MailerOptions & {
  createMessageFiles?: boolean;
  messagesPath?: string;
};

export type LyvelyHttpOptions = {
  appUrl?: string;
  host: string;
  port: number;
  cors?: {
    origin: string;
  };
};

export type LyvelyMongoDBOptions = {
  uri: string;
  debug?: boolean;
  transactions?: boolean;
};

export type LyvelyAuthOptions = {
  jwt: {
    'secure-cookies': boolean;
    access: {
      secret: string;
      expiration: string;
      samesite: string;
    };
    refresh: {
      secret: string;
      expiration: string;
      samesite: string;
    };
  };
};

export type UserPermissionOptions = Record<string, string[]>;

type ModulesConfiguration = { [k: string]: object };

export type LyvelyAppConfiguration = {
  http?: LyvelyHttpOptions;
  mongodb?: LyvelyMongoDBOptions;
  auth?: LyvelyAuthOptions;
  helmet?: HelmetOptions;
  mail?: LyvelyMailOptions;
  modules?: ModulesConfiguration;
  'user-permissions'?: UserPermissionOptions;
  serveStatic?: ServeStaticModuleOptions;
};

// TODO: This is not working for some types
export type ConfigurationPath = LyvelyAppConfiguration & {
  [key in NestedPaths<LyvelyAppConfiguration>]: TypeFromPath<LyvelyAppConfiguration, key>;
};
