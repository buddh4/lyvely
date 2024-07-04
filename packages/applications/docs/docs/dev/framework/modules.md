# Modules

In Lyvely, modules are typically organized into three distinct packages, all managed within a single monorepo:

- `api`: This package encompasses API endpoints and other backend logic.
- `interface`: In this package, you'll find shared logic as models with validation rules, API endpoint interfaces, and endpoint clients.
- `web`: The web package is responsible for implementing the user interface.

Within a modules monorepo, both the `web` and `api` packages have the capability to run their own development servers
right out of the box. This feature is designed to simplify the process of testing and debugging your custom features.

The fundamental structure of a module follows this general outline:

```
├── packages
│   ├── api
│   │   ├── src
│   │   ├── package.json
│   ├── interface
│   │   ├── src
│   │   ├── package.json
│   ├── web
│   │   ├── src
│   │   ├── package.json
│   package.json
```
:::note
The following section outlines the fundamental structure and responsibilities of these three packages. 
Detailed instructions for implementing various aspects of a module are provided later in this documentation.
:::

## The Interface Package

The primary role of the `interface` package is to define endpoint interfaces and model
classes. In certain instances, it also houses shared domain logic used between the API and web layers. 
The `interface` package is essentially a TypeScript library built using [rollup](https://rollupjs.org/). 

In most cases, the `interface` package relies on two key dependencies:

- `@lyvely/interface`: This core package is essential for endpoint definitions and includes other core interfaces.
- `@lyvely/common`: This package is used for model definitions and various helper functions.

A minimal `interface` package, excluding configuration files, typically takes on this structure:

```
├── interface
│   ├── dist
│   ├── src
│   │   ├── endpoints
│   │   │   ├── polls.endpoint.ts
│   │   │   ├── polls.client.ts
│   │   │   ├── polls.repository.ts
│   │   ├── models
│   │   │   ├── polls.model.ts
│   │   ├── polls.constants.ts
│   │   ├── index.ts
```

The interface package is responsible for:

- Shared **models**, **interfaces** and validation rules
- Endpoint **interfaces** and **clients**
- [Permissions definitions](permissions.md)
- [Features definitions](features.md)

## The API Package

The `api` package is responsible for implementing the backend API and other backend services, such as queues, 
workers, and scheduled jobs. The `api` package is essentially a [NestJS](https://nestjs.com/) module, complete with its own dedicated 
test environment.

In most cases, the interface package relies on three key dependencies:

- The modules own `interface` package, which provides endpoint interfaces, models, and helper functions.
- `@lyvely/api`: This is used to access core services and modules, including **Profiles**, **Users**, **Permissions** or **Policies**.
- `@lyvely/common`: This package is utilized for various utility functions.

A minimal `api` package, excluding configuration files, typically adheres to this structure:

```
├── api
│   ├── dist
│   ├── src
│   │   ├── polls.controller.ts
│   │   ├── polls.schema.ts
│   │   ├── polls.service.ts
│   │   ├── polls.dao.ts
│   │   ├── polls.mdoule.ts
│   │   ├── index.ts
```

:::note
For added convenience, the `@lyvely/api` module re-exports the `@lyvely/interface` module, eliminating the need for
explicit imports of the core `interface` package within a modules `api` package. It is a recommended practice to follow
this strategy in your own modules.
:::

:::info
If your module becomes more complex as it evolves, it is advisable to organize your files into directories based on 
their specific types, e.g. `controllers`, `schemas`, `daos`, `services`.
:::

### API Module

The `@LyvelyModule` decorator extends the functionality of a standard [NestJS Module](https://docs.nestjs.com/modules) 
by incorporating Lyvely-specific configuration options. This decorator offers the following additional options:

| Option      | Type        | Description                                       |
|-------------|-------------|---------------------------------------------------|
| id          | string      | A unique module identifier.                       |
| path        | string      | The file path of the module (usually __dirname).  |
| name        | string      | An optional display name for the module.          |
| description | string      | An optional description for the module.           |
| features    | IFeature    | An array of feature definitions.                  |
| permissions | IPermission | An array of permission definitions.               |
| policies    | IPolicy     | An array of policy definitions.                   |

:::note
 Other modules may support additional configuration options.
:::

#### Example

```typescript
@LyvelyModule({
  id: POLLS_MODULE_ID,
  name: 'Polls',
  path: __dirname,
  features: [PollsFeature],
  policies: [], // Could contain poll specific policies
  permissions: [
    CreatePollPermission, 
    ManagePollPermission, 
    WritePollPermission
  ],
  imports: [],
  controllers: [PollsController],
  providers: [ PollsService ],
  exports: [ PollsService ],
})
export class ContentCoreModule {}
```

### API Testing

To initiate the test environment for an `api` package, run one of the following commands: 

- `rush run -t <api-package> -s dev`: Runs a test api server of the selected package.
- `rush run -t <api-package> -s dev:debug`: Runs a test api server in debug mode of the selected package.

Just replace the `<api-package>` with the api package you want to test. This will launch a Lyvely API server with the 
default test configuration on `127.0.0.1:8080`. 

For some core packages the monorepo provides a more convenient way of running a test server:

- `rush api`: Runs the core api test server.
- `rush api:debug`: Runs the core api test server in debug mode.

- `rush server`: Runs a test server for the server application, which includes all feature modules.
- `rush server:debug`: Runs a test server for the server application including all feature modules in debug mode.

## The Web Package

The `web` package is essentially a `VueJs` library, responsible for implementing the modules user interface and
includes its own dedicated test environment. 

This package will typically rely on the following packages:

- `@lyvely/web`: The core web package is used for:
  - Module registration
  - Registration of menu entries
  - UI layout registrations
  - Registration of routes and guards
  - Registration of specific interfaces as content types and features, among other functionalities.
  - Provides the `LyvelyWebApp` for starting the web application.
- `@lyvely/ui`: This package contains core UI components for a seamless integration.
- Its own `interface` package, which is used for importing clients and models to handle validation and domain logic.

:::note
For added convenience, the `@lyvely/web` module re-exports the `@lyvely/interface` module, eliminating the need for
explicit imports of the core `interface` package within a modules `web` package. It is a recommended practice to follow
this strategy in your own modules.
:::

### Web Module

A frontend module consists of the following properties:

| Option       | Description                                             |
|--------------|---------------------------------------------------------|
| id           | A unique module identifier.                             |
| i18n         | Locale file registration.                               |
| icon         | An optional module related icon name.                   |
| dependencies | Array of dependent modules.                             |
| features     | An array of feature definitions.                        |
| permissions  | An array of permission definitions.                     |
| routes       | An array of `RouteRecordRaw` or function returning one. |
| init         | An initializer function for manual installation logic.  |
| install      | Can be used to install vue app extensions and plugins.  |

#### Module `init`

The `init` function can be used to manually initialize aspects of your module as for example registering menu entries,
content types or svg icons.

:::warning
The `init` function is called right before creating the vue application, which means you should not
use any pinia stores directly within this function. (This may change in the future.)
:::

:::tip
Please refer to the [i18n guide](i18n.md#locale-handling-in-the-frontend) for information about handling locales and
translations in the frontend.
:::

### Web Testing

To initiate the test environment for a `web` package, run the `rush -t <web-package> -s dev` command.
This will launch a Lyvely test web server with default test configuration on `127.0.0.1:3000`.

For testing the core or pwa packages there are more convenient ways of starting a web server:

- `rush web`: Runs a test web server for the core web package.
- `rush pwa`: Runs a test web server for the pwa application, which includes all features.
