---
sidebar_position: 2
---

# Installation

Depending on your specific use case and requirements, there are several methods available for installing Lyvely:

## Requirements

1. Install MongoDB

Either install MongoDB by following the [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/administration/install-community/)
or use a [MongoDB Docker Image][https://hub.docker.com/_/mongo](https://www.mongodb.com/docs/manual/administration/install-community/) which
is recommended for developers.

**Example:**

In this example we pull the MongoDB docker image and create a container with the name `lyvely-mongodb` which will be
available on host port `27017` and uses the `/paht/on/host` directory on the host for data persistence. Please
choose a valid path on your environment instead.

```shell
docker pull mongo
docker run --name lyvely-mongodb --restart=always -d -p 27017:27017 -v /path/on/host:/data/db mongo
```

> Note: Some features as transactions are only available when using a [replica set](https://www.mongodb.com/docs/manual/replication/). 
> For testing and development this won't be necessary but is recommended for production use.

2. Install Redis

Similar to the MongoDB installation you can either install [Redis on your system](https://redis.io/docs/install/install-redis/)
or use [Docker](https://hub.docker.com/_/redis) instead.

**Example:**

In this example we pull the Redis docker image and create a container with the name `lyvely-redis` which will be
available on host port `6379` and uses the `/paht/on/host` directory on the host for data persistence. Please
choose a valid path on your environment instead.

```shell
docker pull redis
docker run --name lyvely-redis --restart=always -d -p 6379:6379 -v /path/on/host:/data redis
```

## Git Installation (For Contributors)

1. Clone the Lyvely repository from GitHub using the following command:

```shell
git clone https://github.com/lyvely/lyvely.git
```

2. Navigate to the project directory:

```shell
cd lyvely
```

3. Install the necessary dependencies using npm:

```shell
npm install
```

4. Build the application:

```shell
npx nx run-many -t build
```

5. Configure the server:

Navigate to `packages/server/config` and copy `lyvely.dist.ts` to `lyvely.ts`.

```shell
cd packages/server/config
cp lyvely.dist.ts lyvely.ts
```

The only mandatory change in the server configuration is the configuration of JWT secrets within the `lyvely.ts`
configuration. You can use the following command:

```shell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

In case you need to align some ports or other configuration options edit your newly created config file.

6. Configure the frontend:

Navigate to `packages/pwa` and copy `.env.dist` to `.env`.

```shell
cd ../..
cd packages/pwa
cp lyvely.dist.ts lyvely.ts
```

In case you need to align some ports or other configuration options edit your newly created config file.

7. Run the server

```shell
npx nx run @lyvely/server:start:dev
```

8. Run frontend

```shell
npx nx run @lyvely/pwa:dev
```

> Note: The `@lyvely/server` and `@lyvely/pwa` applications internally depend on `@lyvely/core` and `@lyvely/web` and automatically
> install some feature modules as Habits, Tasks, Milestones.
> During core development, you can directly run the core packages using the following commands:
> 
> - `npx nx run @lyvely/core:dev`
> - `npx nx run @lyvely/web:dev`
> 
> These commands enable hot reloading, eliminating the need to redeploy the projects on every change. 
> When working on a custom feature project, you can also run a development server within those frontend or backend project
> to comfortably work on those modules.

## Docker Installation

Comming Soon!

The `docker` directory includes an `docker-compose` example of how to setup a lyvely environment with nginx, redis and mongodb
with a local replica-set.