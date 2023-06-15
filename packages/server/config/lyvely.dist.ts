import { LyvelyAppConfiguration } from '@lyvely/server-core';

export default {
  appName: 'lyvely.app',
  operationMode: 'standalone',
  docUrl: 'https://docs.lyvely.app',
  contactMail: 'help@lyvely.app',
  redis: {
    host: 'localhost',
    port: 6379,
  },
  http: {
    host: 'localhost',
    port: 8080,
    baseUrl: 'http://localhost:8080',
    appUrl: 'http://localhost:3000',
  },
  mongodb: {
    uri: 'mongodb://localhost:27017/lyvely',
    debug: false,
  },
  mail: {
    transport: {
      streamTransport: true,
    },
    preview: {
      dir: `${process.cwd()}/mail/messages/test`,
      open: true,
    },
  },
  auth: {
    jwt: {
      'secure-cookies': false,
      access: {
        secret: undefined, // CHANGEME!
        expiresIn: '2m',
        sameSite: 'lax',
      },
      refresh: {
        secret: undefined, // CHANGEME!
        expiresIn: '5m',
        expiresInRemember: '200d',
        sameSite: 'lax',
      },
      verify: {
        secret: undefined, // CHANGEME!
        expiresIn: '1d',
      },
    },
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        'img-src': ["'self'", 'lyvely.app'],
      },
    },
  },
  legal: {
    sections: {
      poweredBy: {
        label: 'Powered by lyvely',
        url: 'https://www.lyvely.app',
        version: '1.0',
      },
    },
  },
} as LyvelyAppConfiguration;
