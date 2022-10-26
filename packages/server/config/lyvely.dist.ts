import { LyvelyAppConfiguration } from '@/core';

export default {
  appName: 'lyvely.app',
  docUrl: 'https://docs.lyvely.app',
  contactMail: 'help@lyvely.app',
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
        samesite: 'lax',
      },
      refresh: {
        secret: undefined, // CHANGEME!
        expiresIn: '5m',
        expiresInRemember: '200d',
        samesite: 'lax',
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
} as LyvelyAppConfiguration;
