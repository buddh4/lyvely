import { HelmetOptions } from 'helmet';
import { MailerOptions } from '@nestjs-modules/mailer';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { NestedPaths, TypeFromPath } from '@lyvely/common';

export type LyvelyMailOptions = MailerOptions & {
  createMessageFiles?: boolean;
  messagesPath?: string;
  footerText?: string;
  footerSubtext?: string;
};

export type LyvelyHttpOptions = {
  appUrl?: string;
  baseUrl: string;
  host: string;
  port: number;
  cors?: {
    origin: string;
  };
  rateLimit?: {
    ttl: number;
    limit: number;
  };
};

export type LyvelyMongoDBOptions = {
  uri: string;
  debug?: boolean;
  transactions?: boolean;
};

export type I18NOptions = {
  locales: string[];
};

export type LyvelyAuthOptions = {
  jwt: {
    'secure-cookies': boolean;
    issuer?: string;
    access: {
      secret: string;
      expiresIn: string;
      samesite: string;
    };
    refresh: {
      secret: string;
      expiresIn: string;
      expiresInRemember: string;
      samesite: string;
    };
    verify: {
      secret: string;
      expiresIn: string;
    };
  };
};

export type UserPermissionOptions = Record<string, string[]>;

type ModulesConfiguration = {} & { [k: string]: object };

export type LyvelyAppConfiguration = {
  appName: string;
  docUrl?: string;
  contactMail: string;
  i18n?: I18NOptions;
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
export type ConfigurationPath = {
  [key in NestedPaths<LyvelyAppConfiguration>]: TypeFromPath<LyvelyAppConfiguration, key>;
};
