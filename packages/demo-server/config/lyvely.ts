import { LyvelyAppConfiguration } from '@lyvely/server/dist/src/modules/core';

export default {
  appName: 'demo',
  http: {
    host: 'localhost',
    port: 8080,
    appUrl: 'http://localhost:3000',
  },
  mongodb: {
    uri: 'mongodb://localhost:27017/lyvely',
    debug: false,
  },
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
        expiresIn: '200d',
        sameSite: 'lax',
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
