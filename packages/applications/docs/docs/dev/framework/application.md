# Application

Lyvely is composed of two main components: a frontend and a backend application. This guide outlines the steps to 
manually configure and run a custom Lyvely platform.

:::tip
The Lyvely monorepository contains example applications that showcase all key features, located in the 
`packages/applications` directory.
:::

## API

To start a Lyvely API instance, you can initialize a `LyvelyServer` instance using the `@lyvely/api` package. Below is 
an example of how to bootstrap the server:

```typescript
new LyvelyServer().bootstrap({
  modules: [
    // Add feature modules here
  ],
  configFiles: [`config/lyvely.${process.env.NODE_ENV}.config.ts`],
});

```

The `bootstrap` function accepts the following options:

| Option              | Description                                                                                               |
|---------------------|-----------------------------------------------------------------------------------------------------------|
| `config`            | An optional partial `ServerConfiguration` object for overriding default settings.                          |
| `configFiles`       | An array of file paths pointing to configuration files.                                                    |
| `loadDefaultConfig` | Whether to load the default configuration files. (default: true)                                           |
| `loadDBConfig`      | Whether to load the configuration from the database. (default: true)                                       |
| `modules`           | An array of additional feature modules to include in the application.                                      |
| `serveStatic`       | Enables the [serveStatic](../../admin/intro/server-configuration.md#serve-static) module. (default: false)  |

The application will load and merge the configuration in the following order:

1. Default configuration (unless `loadDefaultConfig` is set to false).
2. Configuration files provided by the `configFiles` option.
3. Configuration object provided by the `config` option.
4. Database configuration (unless `loadDBConfig` is set to false).

:::info
For a complete list of configuration options, refer to the [Server Configuration Guide](../../admin/intro/server-configuration.md).
:::

## Web

To start a Lyvely Web application, you can initialize a `LyvelyWebApp` instance using the `@lyvely/web` package. Below is
an example of how to initialize the web application:

```typescript
new LyvelyWebApp({
  modules: [
    // Add feature modules here
  ],
})
  .init('#app')
  .catch((err) => console.error(err));
```
The `LyvelyWebApp` constructor accepts the following options:

| Option           | Description                                                                |
|------------------|----------------------------------------------------------------------------|
| `modules`        | An array of additional feature modules to include in the application.      |
| `baseUrl`        | The url of the web application itself. (default: `window.location.origin`) |
| `apiUrl`         | The url of the backend API (default: `baseUrl/api`)                        |
| `fallbackLocale` | The fallback locale (default: `en-us`                                      |
| `env`            | `production` or `development` (default: `production`)                      |


### PWA

The `@lyvely/pwa` package integrates a service worker with Progressive Web App (PWA) features, leveraging the 
[Vite PWA library](https://vite-pwa-org.netlify.app/). It can be implemented as shown in the example below:

```typescript
new LyvelyWebApp({
  baseUrl: import.meta.env.VITE_APP_BASEURL || 'http://127.0.0.1:3000',
  apiUrl: import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:8080/api'
  env: import.meta.env.VITE_APP_ENV || 'production',
  modules: [
    // Additional feature modules
    pwaModule(),
  ],
})
  .init('#app')
  .then((app: LyvelyWebApp) => {
    const updateSW = registerSW({
      onNeedRefresh() {
        app.events.emit('app.need.refresh', updateSW);
      },
      onOfflineReady() {
        app.events.emit('app.offline.ready');
      },
    });
  })
  .catch((err) => console.error(err));
```
