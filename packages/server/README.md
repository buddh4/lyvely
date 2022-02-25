## Development environment

In a development environment you should use a npm link to the common library instead of
including the package:

1. Create common link

Run the following within your common project folder:
```
npm link
```

2. Link the common library

Run the following within your web and server project folder:
```
npm link lyvely-common
```

## Modules

### Create new module

```
nest generate module <name>
```

## Migration

### Install

```
npm install -g migrate-mongo
```

### Add migration

```
npm run migrate:create name-of-my-script
```

### Show status

```
npm run migrate:status
```

### Run migrations

```
npm run migrate:up
```

## Testing

### Run unit tests:

```
npn run test
```

### Run e2e tests:

1. Create and configure `.e2e.env` e.g:

```
MONGODB_URI=mongodb://localhost/lyvely-e2e
```

2. Start e2e env backend

```
npm run start:e2e
```

3. Open cypress

```
npx cypress open
```

## Check for circular dependencies

```
npx madge --circular --extensions ts ./
```
## Security

Set a `JWT_ACCESS_TOKEN_SECRET` in your environment. The secret must be at least 64 characters long.
You can generate a random secret with:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

## Debugging

```
npm run start:debug
```
**PhpStorm run config:**

![](docs/img/4f6a6bd9.png)