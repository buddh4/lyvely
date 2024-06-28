import { ServerConfiguration } from '@/core';
import { VisitorMode } from '@lyvely/interface';

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
    host: '127.0.0.1',
    port: 8080,
    baseUrl: 'http://127.0.0.1:8080/api',
    appUrl: 'http://127.0.0.1:3000',
  },
  modules: {
    auth: {
      jwt: {
        'secure-cookies': false,
        access: {
          secret: '8ebcf42ef2e594bc5dd621cae5bbfc161ca895360b0635824d4b8dc4308f6dfb',
          expiresIn: '2m',
          sameSite: 'lax',
        },
        refresh: {
          secret: 'b0e62b7f11fe0c18d9022c3bc8fa177d66e073f6e183dbb0fcac763e05292d73',
          expiresIn: '5m',
          expiresInRemember: '200d',
          sameSite: 'lax',
        },
        verify: {
          secret: 'd660cef7e949e6935a0fc86c073a41363b539542883b18f2e74874ef09dc4482',
          expiresIn: '1d',
        },
      },
    },
    permissions: {
      visitorStrategy: {
        mode: VisitorMode.Enabled,
        handles: ['welcome'],
      },
    },
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
} as ServerConfiguration;
