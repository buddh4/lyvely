import { HelmetOptions } from 'helmet';
import { MailerOptions } from '@nestjs-modules/mailer';

export type LyvelyHttpOptions = {
  host: string,
  port: number,
  cors: {
    origin: string
  }
}

export type LyvelyMongoDBOptions = {
  uri: string,
  debug?: boolean,
}

export type LyvelyAuthOptions = {
  jwt: {
    'secuire-cookies': boolean,
    access: {
      secret: string,
      expiration: string,
      samesite: string
    },
    refresh: {
      secret: string,
      expiration: string,
      samesite: string
    }
  }
}

export type LyvelyHelmetOptions = {
  jwt: {
    'secuire-cookies': boolean,
    access: {
      secret: string,
      expiration: string,
      samesite: string
    },
    refresh: {
      secret: string,
      expiration: string,
      samesite: string
    }
  }
}

type ModulesConfiguration = {[k:string]: object}

export type LyvelyAppConfiguration = {
  http: LyvelyHttpOptions,
  mongodb: LyvelyMongoDBOptions,
  auth: LyvelyAuthOptions,
  helmet?: HelmetOptions,
  mail?: MailerOptions,
  modules?: ModulesConfiguration
}

export type LyvelyConfigurationGetter = LyvelyAppConfiguration & { [k:`${string}.${string}`]: any };
