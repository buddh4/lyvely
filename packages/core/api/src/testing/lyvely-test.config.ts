import { OperationMode, ServerConfiguration } from '@/core';
import { VisitorMode } from '@lyvely/interface';
import { join } from 'path';

const lyvelyTestConfig: ServerConfiguration = {
  appName: 'lyvely.test.app',
  operationMode: OperationMode.STANDALONE,
  docUrl: 'https://docs.lyvely.app',
  contactMail: 'test@test.de',
  http: {
    baseUrl: 'https://api.test.com',
    host: '127.0.0.1',
    port: 8080,
    appUrl: 'https://test.com',
  },
  redis: {
    host: '0.0.0.0',
    port: 6379,
  },
  mongodb: {
    uri: 'mongodb://localhost:27017/lyvely',
    debug: false,
  },
  modules: {
    auth: {
      jwt: {
        'secure-cookies': false,
        access: {
          secret: 'e5d2ece45d3b7919fc7b6a8f19abc0cb7916c71bef385ca11f27a0a3b324e3d2',
          expiresIn: '15m',
          sameSite: 'lax',
        },
        refresh: {
          secret: 'e5d2ece45d3b7919fc7b7a8f19abc0cb7916c71bef385ca11f27a0a3b324e3d2',
          expiresIn: '30m',
          expiresInRemember: '200d',
          sameSite: 'lax',
        },
        verify: {
          secret: 'e5d2ece45d3b7919fc7b7aff19abc0cb7916c71bef385ca11f27a0a3b324e3d2',
          expiresIn: '1d',
        },
      },
    },
    files: {
      storage: {
        local: {
          dest: join(process.cwd(), 'storage', 'test'),
        },
      },
    },
    permissions: {
      visitorStrategy: { mode: VisitorMode.Enabled, handles: ['welcome'] },
    },
  },
  i18n: {
    locales: ['en', 'de'],
  },
  mail: {
    createMessageFiles: true,
    messagesPath: `${process.cwd()}/mail/messages/test`,
    transport: {
      jsonTransport: true,
    },
    defaults: {
      from: '"No Reply" <no-reply@test>',
    },
    preview: false,
    template: {
      options: {
        strict: true,
      },
    },
  },
};

export default lyvelyTestConfig;
