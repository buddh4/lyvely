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
│   │   ├── package.json
│   ├── interface
│   │   ├── package.json
│   ├── web
│   │   ├── package.json
│   package.json
```
:::note
The following section outlines the fundamental structure and responsibilities of these three packages. 
Detailed instructions for implementing various aspects of a module are provided later in this documentation.
:::

## The Interface Package

The primary role of the `interface` package is to define endpoint interfaces and model or DTO (Data Transfer Object) 
classes. In certain instances, it also houses shared domain logic used between the API and web layers. 
The `interface` package is essentially a TypeScript library built using `rollup`. 

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

- Defining shared models and interfaces
- Defining endpoint interfaces and clients
- Defining [permissions](permissions.md)
- Defining [features](features.md)

## The API Package

The `api` package is responsible for implementing the backend API and other backend services, such as queues, 
workers, and scheduled jobs. The `api` package is essentially a `NestJS` module, complete with its own dedicated 
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
explicit imports of the core `interface` package within a modules `api` package.
:::

:::info
If your module becomes more complex as it evolves, it is advisable to organize your files into directories based on 
their specific types, e.g. `controllers`, `schemas`, `daos`, `services`.
:::

### API Module

The `@LyvelyModule` decorator extends the functionality of a standard [NestJS Module](https://docs.nestjs.com/modules) 
by incorporating Lyvely-specific configuration options.

The `@LyvelyModule` decorator offers the following additional options:

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

To initiate the test environment for an `api` package, run the `pnpm run dev -w my-module-api` command. 
This will launch a Lyvely API server with the default test configuration on `127.0.0.1:8080`.

## The Web Package

The `web` package is essentially a `VueJs` library, responsible for implementing the modules user interface and
includes its own dedicated test environment. 

This package will typically rely on the following packages:

- `@lyvely/web`: The core web package is used for:
  - Module registration
  - Registration of menu entries
  - UI component registrations
  - UI layout registrations
  - Registration of routes and guards
  - Registration of specific interfaces as content types and features, among other functionalities.
- `@lyvely/ui`: This package contains core UI components for a seamless integration.
- Its own `interface` package, which is used for importing clients and models to handle validation and domain logic.

:::note
For added convenience, the `@lyvely/web` module re-exports the `@lyvely/interface` module, eliminating the need for
explicit imports of the core `interface` package within a modules `web` package.
:::

### Web Module

A frontend module consists of the following properties:

| Option       | Description                                             |
|--------------|---------------------------------------------------------|
| id           | A unique module identifier.                             |
| i18n         | Locale file registration.                               |
| dependencies | Array of dependent modules.                             |
| features     | An array of feature definitions.                        |
| permissions  | An array of permission definitions.                     |
| routes       | An array of `RouteRecordRaw` or function returning one. |
| init         | An initializer function for manual installation logic.  |
| install      | Can be used to install vue app extensions and plugins.  |

#### Module `init`

The `init` function can be used to manually initialize aspects of your module as registering menu entries or
new content types.

:::warning
The `init` function is called right before creating the vue application, which means you should not
use any pinia stores directly within this function. (This may change in the future)
:::

#### Locales

The `i18n` option can be used to register locale files. This allows you to create and load specific translations
on demand. There are two special keys to consider:

- `base`: This locale file will be loaded once the application starts and may contain translations that need to be 
available on startup, such as menu entries or notification texts.
- `locale`: This is the default locale file of the module and may be loaded when accessing module-related routes as 
in the following route configuration:

```typescript
export const pollsRoutes: RouteRecordRaw[] = [
  {
    name: 'Polls',
    path: profilePath('/polls'),
    meta: {
      i18n: { load: ['polls'] }, // This will load the the default locale when entering the route.
      layout: LAYOUT_PROFILE,
      title: () => t('habits.title'),
    },
    component: () => import('../views/PollsView.vue'),
  },
];
```

#### Example:

```typescript
export const pollsModule = () => {
  return {
    id: POLLS_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
    dependencies: [someOtherModule()],
    features: [PollsFeature],
    routes: habitRoutes,
    init: () => {
      registerMenuEntry(MENU_PROFILE_DRAWER, () => ({
        id: 'profile-polls',
        moduleId: POLLS_MODULE_ID,
        text: 'polls.title',
        sortOrder: 1501,
        features: PollsFeature.id,
        icon: 'polls',
        condition: useProfileFeatureStore().isFeatureEnabled(PollsFeature.id),
        to: { name: 'Polls' },
      }));
      
      registerContentType({
        type: PollsModel.contentType,
        moduleId: POLLS_MODULE_ID,
        name: translation('polls.name'),
        icon: 'polls',
        feature: PollsFeature.id,
        modelClass: PollsModel,
        interfaces: {
          create: {
            mode: 'modal',
            modelClass: CreatePollModel,
            component: () => import('./components/modals/EditPollModal.vue'),
          },
          edit: {
            mode: 'modal',
            component: () => import('./components/modals/EditPollModal.vue'),
          },
          stream: {
            details: () => import('./components/content-stream/PollsDetails.vue'),
            entry: () => import('./components/content-stream/PollsStreamEntry.vue'),
          },
        },
      });
    },
  } as IModule;
};
```


### Web Testing

To initiate the test environment for a `web` package, run the `pnpm run web:dev` command.
This will launch a Lyvely web test server with the default test configuration on `127.0.0.1:3000`.
This requires the API test environment of the same module to run.
