# API Configuration

This section provides an overview of common configuration options for the Lyvely backend server. 
Typically, backend configuration is managed within the `config/lyvely.ts` file. 
However, at present, you have the flexibility to modify server options by specifying them in your main.ts file as shown
below:

```typescript
import { LyvelyServer } from '@lyvely/api';

new LyvelyServer().bootstrap({
  configFiles: ['lyvely-dev.config.ts'],
});
```

Additionally, you have the ability to override any configuration settings using the provided bootstrap options.

## Basic configuration

The following basic server configurations are available:

- `appName`: The name of the app, displayed in the frontend.
- `docUrl`: URL of the documentation, accessible from the frontend.
- `contactMail`: Contact email address for support and inquiries.
- `operationMode`: Operation mode setting, with plans for future expansion. Currently supports `standalone` mode.


## Serve the frontend through the NestJs server

Lyvely can utilize the [Serve Static NestJs module](https://docs.nestjs.com/recipes/serve-static) to serve the frontend 
through the backend. To set up this configuration, follow these steps:

Add the following snippet to your `lyvely.ts`  configuration, specifying the rootPath as the path to your web
application's distribution folder:

```typescript
{
  serveStatic: {
    rootPath: '/path/to/your/web/dist'
  }
}
```

By default, your frontend will be served under the root server path, while the api is available under the `/api` path.

> For additional configuration options and detailed information, please consult the [Serve Static module documentation](https://docs.nestjs.com/recipes/serve-static).

## MongoDB

Lyvely uses the [NestJs Mongoose module](https://docs.nestjs.com/techniques/mongodb) to establish and manage connections
with MongoDB.

For a basic MongoDB configuration, you can use the following example:

```typescript
{
  mongodb: {
    uri: 'mongodb://localhost:27017/lyvely'
  }
}
```

If you run a MongoDB configuration with a replica set, you can use the following example:


```typescript
{
  mongodb: {
    uri: 'mongodb://mongodb1:27017,mongodb2:27017,mongodb3:27017/lyvely?replicaSet=rs0&readPreference=primary',
    replicaSet: true,
    transactions: true
  }
}
```

The `replicaSet` and `transactions` flags are used to indicate that replicaset and transaction support are enabled 
on the server.

> For additional configuration options and detailed information, please consult the 
> [NestJs Mongoose module documentation](https://docs.nestjs.com/techniques/mongodb).

## Redis

Redis is used for multiple purposes the default redis endpoint can be configured as follows:

```typescript
{
  redis: {
    host: 'localhost',
    port: 6379,
  }
}
```

## Http

The following `http` configuration under the http configuration key are supported:


- `baseUrl`: The base url of the API.
- `host`: The host name of the API.
- `port`: The port of the API.
- `appUrl`: Defines the base url of the app, which is used for building urls and redirects.
- `cors`: Cross-Origin Resource Sharing (CORS) configuration, see [NestJs Cors](https://docs.nestjs.com/security/cors).
- `tls`: Transport Layer Security (TLS) configuration, see [NodeJs TLS](https://nodejs.org/api/tls.html#tlscreateserveroptions-secureconnectionlistener).
- `trustProxy`: Trust proxy configuration, used when the API is behind a proxy, see [Express Behind Proxies](https://expressjs.com/en/guide/behind-proxies.html).
- `compression`: HTTP compression configuration, see [ExpressJs compression](https://github.com/expressjs/compression).
- `rateLimit`: Default rate limit used for non sensitive endpoints.
  - `ttl`: The number of milliseconds that each request will last in storage.
  - `limit`: The maximum number of requests within the TTL limit.

## I18n

The I18n configuration can be used to restrict the supported locales.

```typescript
{
  i18n: {
    locales: ['en-us']
  }
}
```

## Auth

In this section, you can configure the details of JWT tokens used for authentication, token refreshing and other verifications
within the application. Lyvely employs three distinct types of JWT tokens

- `access`: Used for accessing the API as an authenticated user.
- `refresh` Used for refreshing the access token, ensuring continuous access.
- `verify` Utilized for a variety of purposes, e.g. email verification and other use cases.

**Example Configuration:**

```typescript
{ 
  modules: {
    auth: {
      jwt: {
        'secure-cookies': true,
          access: {
          secret: 'CHANGEME!',
            expiresIn: '2m',
            sameSite: 'lax',
        },
        refresh: {
          secret: 'CHANGEME!',
            expiresIn: '5m',
            expiresInRemember: '200d',
            sameSite: 'lax',
        },
        verify: {
          secret: 'CHANGEME!',
            expiresIn: '1d',
        },
      },
    }
  }
}
```

To generate secrets for these tokens, you can use the following command:

```shell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

> Note: In a production environment the `secure-cookies` should be set to true and the sameSite to `lax` or `strict`.

## Helmet

Lyvely utilizes the [NestJs Helmet middleware](https://docs.nestjs.com/security/helmet) to protect the application from
some common http vulnerabilities.

**Example**

The following example shows a very simple content-security-policy header configuration:

```typescript
{
  helmet: {
    contentSecurityPolicy: {
      directives: {
        'img-src': ["'self'", 'lyvely.app'],
      },
    },
  }
}
```

> Please consult the [Helmet documentation](https://github.com/helmetjs/helmet#how-it-works) for more
available and default configuration options.

## Files & Storage

The `files` configuration can be used to configure different storage providers and set the path for uploaded files:

```typescript
{
  files: {
    upload: {
      // Used for file uploads, this should be a temporary folder (Default: storage.local.dest/tmp).
      dest: '/my/upload/path',
      limits: {
        // For multipart forms, the max file size (in bytes)(Default: Infinity).
        fileSize: number
      }
    },
    storage: {
      // Here we configure our custom storage provider and set it as default.
      default: 'MyStorage',
      providers: [
        id: 'MyStorage',
        class: MyStorageProvider,
        options: { 
        // Some provider options 
        }
      ],
      buckets: [
        // Here we make an exception for avatars, which we prefer to serve from local storage.
        { name: 'local', bucket: 'avatars' }
      ]
    }
  }
}
```

> Note: Currently we only support local file storage for example for avatars in the future other storage provider are
> planned.

## Mail

Lyvely employs [NestJs Mailer](https://github.com/nest-modules/mailer) which is powered by
[Node Mailer](https://nodemailer.com/) for sending emails. Below is an example of a common configuration often
used in test environments:

```typescript
{
  mail: {
    transport: {
      streamTransport: true,
    },
    preview: {
      dir: `${process.cwd()}/mail/messages/test`,
      open: true,
    },
  },
}
```

This configuration will not send any emails but instead store them as files within the `mail/messages/test` directory within
your Lyvely server root. Additionally, it automatically opens a preview of the email in a web browser.

Below, you'll find a production-ready mail configuration:

```typescript
{
  mail: {
    transport: {
      host: 'mail.myapp.com',
      port: 587,
      pool: true,
      secure: false, // upgrade later with STARTTLS https://nodemailer.com/smtp/
      ignoreTLS: false,
      auth: {
        user: 'SomeUser',
        pass: 'SomePassword'
      }
    },
    defaults: {
      from: '"MyApp" <no-reply@myapp.com>',
    },
  }, 
}
```

> Please consult [Node Mailer](https://nodemailer.com/) for further configuration options.

## Features

The `features` configuration can be used to change the default settings for features as:

- Disable features by default which are enabled by default
- Enable features which are disabled by default
- Make features configurable in the frontend which are not configurable by default
- Disable frontend configuration capabilities for certain features
- Change of suggested features used when creating a profile

On profile level, features can be configured for various types of profiles. The example below shows some use cases for
the feature configuration:

Disable the `tasks` feature by default. Profile admins can still install this feature manually.

```typescript
{
  features: {
    profiles: {
      default: { disabled: ['tasks'] }
    }
  }
}
```

Enable the `premium` feature for organization profiles and disable it on all other profiles.

```typescript
{
  features: {
    profiles: {
      default: { disabled: ['premium'], fixed: ['premium'], nonInstallable: ['premium'] },
      Organization: { enabled: ['premium'], suggested: ['premium'] }
    }
  }
}
```


Only enable the `premium` feature for profiles with a subscription of `professional`.

```typescript
{
  features: {
    profiles: {
      default: { disabled: ['premium'], fixed: ['premium'], nonInstallable: ['premium'] },
      subscription: { professional: { enabled: ['premium'], suggested: ['premium'] }}
    }
  }
}
```

Further restrict the example above by only enabling the `premium` feature for organizations with a subscription of `professional`.

```typescript
{
  features: {
    profiles: {
      default: { disabled: ['premium'], fixed: ['premium'], nonInstallable: ['premium'] },
      Organization: { 
          subscription: { professional: { enabled: ['premium'], suggested: ['premium'] }}
      }
    }
  }
}
```

## Permissions

By means of the `permissions` configuration, you can configure default permissions and access rules.
The following configuration will overwrite the default permission level of a permission with the id `some.permission`
and also enable access for non-authenticated visitors.

```typescript
import {ProfileRelationRole} from "@lyvely/interface";

{
  permissions: {
    defaults: [{id: 'some.permission', role: ProfileRelationRole.Admin}],
    allowVisitors: true
  }
}
```

## User Registration Mode

The `userRegistration` configuration allows you to customize the user registration mode:

```typescript
{
  modules: {
    userRegistration: {
      mode: 'public',
    }
  }
}
```

Currently, the following modes are supported:

- `public`: Users can sign up manually.
- `invite`: Users can only join if invited.
- `none`: Registration is not allowed.
