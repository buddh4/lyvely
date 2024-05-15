import { ServerConfiguration } from '@/config';
import { VisitorMode } from '@lyvely/interface';

const mail = process.env.MAIL_HOST
  ? {
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT || 587,
        pool: true,
        secure: false, // upgrade later with STARTTLS https://nodemailer.com/smtp/
        ignoreTLS: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"lyvely" <${process.env.MAIL_USER}>`,
      },
    }
  : {
      transport: {
        streamTransport: true,
      },
      preview: {
        dir: `${process.cwd()}/mail/messages/test`,
        open: true,
      },
    };

export default {
  appName: process.env.APP_NAME || 'lyvely.app',
  operationMode: 'standalone',
  docUrl: 'https://docs.lyvely.app',
  contactMail: 'help@lyvely.app',
  permissions: {
    visitorStrategy: {
      mode: VisitorMode.Disabled,
    },
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
  http: {
    host: process.env.API_HOST || '127.0.0.1',
    port: process.env.API_PORT || 8080,
    baseUrl: process.env.BASE_URL || 'http://127.0.0.1:8080/api',
    appUrl: process.env.APP_URL || 'http://127.0.0.1:3000',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/lyvely',
    debug: false,
  },
  mail,
  auth: {
    jwt: {
      'secure-cookies': true,
      access: {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '2m',
        sameSite: 'lax',
      },
      refresh: {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_ACCESS_SECRET,
        expiresIn: '5m',
        expiresInRemember: '200d',
        sameSite: 'lax',
      },
      verify: {
        secret: process.env.JWT_VERIFY_SECRET || process.env.JWT_ACCESS_SECRET,
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
} as ServerConfiguration;
