# Modules

## Concept

### Module config

- Each module has a config e.g. module.js

### Single package?

In order to prevent rebuilding the frontend app on each module installation, we need a way for publishing an updating
frontend modules to the frontend app.

- Modules have a server and client folder, separating backend from frontend logic
- The backend is responsible for sending and syncing the frontend

### Backend modules

Backend modules are loaded dynamically in order to prevent the need to rebuild the backend app on each module install/update.
Module dependencies should also be loaded dynamically since we can not assure the existence of non core modules.

```
const CalendarModule = ModuleLoader.loadModule('calendar'); // internally we use import() but do the path resultion ourselves
```

Ideally modules should not depend on other non-core modules, but instead communicate by events.

## Module configuration

## Events
