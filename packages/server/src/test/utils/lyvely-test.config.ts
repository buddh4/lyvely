import { LyvelyAppConfiguration, OperationMode } from '@/core';

const lyvelyTestConfig: LyvelyAppConfiguration = {
  appName: 'lyvely.test.app',
  operationMode: OperationMode.STANDALONE,
  docUrl: 'http://docs.lyvely.app',
  contactMail: 'test@test.de',
  http: {
    baseUrl: 'https://api.test.com',
    host: 'localhost',
    port: 8080,
    appUrl: 'https://test.com',
  },
  auth: {
    jwt: {
      'secure-cookies': false,
      access: {
        secret: 'e5d2ece45d3b7919fc7b6a8f19abc0cb7916c71bef385ca11f27a0a3b324e3d2',
        expiresIn: '15m',
        samesite: 'lax',
      },
      refresh: {
        secret: 'e5d2ece45d3b7919fc7b7a8f19abc0cb7916c71bef385ca11f27a0a3b324e3d2',
        expiresIn: '30m',
        expiresInRemember: '200d',
        samesite: 'lax',
      },
      verify: {
        secret: 'e5d2ece45d3b7919fc7b7aff19abc0cb7916c71bef385ca11f27a0a3b324e3d2',
        expiresIn: '1d',
      },
    },
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
