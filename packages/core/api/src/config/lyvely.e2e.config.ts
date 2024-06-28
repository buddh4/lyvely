import { ServerConfiguration } from '@/core';
import path from 'path';
import { VisitorMode } from '@lyvely/interface';

export default {
  appName: 'Lyvely e2e',
  operationMode: 'standalone',
  files: {
    storage: {
      local: {
        dest: path.resolve(process.cwd(), '../web/cypress/uploads'),
      },
    },
  },
  http: {
    host: '127.0.0.1',
    port: 8081,
    appUrl: 'http://127.0.0.1:3002',
    baseUrl: 'http://127.0.0.1:8081/api',
    rateLimit: {
      skipIf: () => true,
    },
  },
  modules: {
    auth: {
      jwt: {
        'secure-cookies': false,
        access: {
          expiresIn: '20min',
          sameSite: 'lax',
          secret: 'e5d2ece45d3b7919fc7b6a8f19abc0cb7916c71bef385ca11f27a0a3b324e3d2',
        },
        refresh: {
          expiresIn: '20min',
          sameSite: 'lax',
          expiresInRemember: '20min',
          secret: 'e5d2ece45d3b7919fc7b7a8f19abc0cb7916c71bef385ca11f27a0a3b324e3d2',
        },
        verify: {
          expiresIn: '20min',
          sameSite: 'lax',
          secret: 'd660cef7e949e6935a0fc86c073a41363b539542883b18f2e74874ef09dc4482',
        },
      },
    },
    permissions: {
      visitorStrategy: {
        mode: VisitorMode.Enabled,
        handles: ['public-group'],
      },
    },
  },
  mongodb: {
    uri: process.env.MONGODB_URI_E2E || 'mongodb://localhost:27017/lyvely-e2e',
  },
  csrf: {
    // Browsers have trouble with cookies on non https sites...
    enabled: false,
  },
  mail: {
    transport: {
      streamTransport: true,
    },
    preview: {
      dir: path.resolve(process.cwd(), '../web/cypress/mails'),
      open: false,
    },
  },
} as Partial<ServerConfiguration>;
