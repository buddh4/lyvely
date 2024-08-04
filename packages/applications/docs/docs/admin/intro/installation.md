---
---

# Installation

Depending on your specific use case and requirements, there are several methods available for installing Lyvely:

## Requirements

- [Node.js](https://nodejs.org) (version >= 20)
- [MongoDB](https://www.mongodb.com) (version >= 7)
- [Redis](https://redis.io/) (version >= 7)
- [Rush](https://rushjs.io)

### Install MongoDB

Either install MongoDB by following the [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/administration/install-community/)
or use the [MongoDB Docker Image](https://hub.docker.com/_/mongo) which
is recommended especially for developers.

**Example:**

In this example we pull the MongoDB docker image and create a container with the name `lyvely-mongodb` which will be
available on host port `27017` and uses the `/paht/on/host` directory on the host for data persistence. Please
choose a valid path on your environment instead.

```shell
docker pull mongo
docker run --name lyvely-mongodb --restart=always -d -p 27017:27017 -v /path/on/host:/data/db mongo
```

:::note
Some features as transactions are only available when using a [replica set](https://www.mongodb.com/docs/manual/replication/).
For testing, development and simple installations this won't be necessary but is recommended for production use.
:::

:::tip
Check the `docker` directory for a docker compose setup using replication.
:::

### Install Redis

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

### Install Rush

Rush is used for monorepo management and many tasks as building the project or running and testing applications.

```shell
npm install -g @microsoft/rush
```

## Git Installation

1. Clone the Lyvely repository from GitHub using the following command:

```shell
git clone https://github.com/buddh4/lyvely.git
```

2. Navigate to the project directory:

```shell
cd lyvely
```

3. Install the necessary dependencies using npm:

```shell
rush update
```

4. Build the application:

```shell
rush build
```

5. Configure the server:

Navigate to `packages/server/src/config` and copy `lyvely.development.config.ts.dist` to `lyvely.development.config.ts`.

```shell
cd packages/applications/server/src/config
cp lyvely.development.config.ts.dist lyvely.development.config.ts
```

The only mandatory change in the server configuration is the configuration of JWT secrets. 
You can use the following command to generate a secret:

```shell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

In case you need to align some ports or other configuration options edit your newly created config file.

6. Configure the frontend:

Navigate to `packages/applications/pwa` and copy `.env.dist` to `.env`.

```shell
cd packages/applications/pwa
cp .env.dist .env
```

In case you need to align some ports or other configuration options edit your newly created config file.

7. Run the server

```shell
rush server:dev
```

or for watch/debug support:

```shell
rush server:debug
```

8. Run frontend

```shell
rush pwa:dev
```

:::note
The `@lyvely/server` and `@lyvely/pwa` applications internally depend on `@lyvely/api` and `@lyvely/web` 
and automatically installs all features modules provided by the main repository as:
 - **Habits**
 - **Tasks**
 - **Journals**
 - **Milestones**
 - **Legal**
 - **Analytics**
:::

:::tip
All feature modules as well as the core `@lyvely/web` and `@lyvely/api` workspaces support starting a development
environment.

- For `@lyvely/api` run `rush api:dev` or `rush api:debug`.
- For `@lyvely/web` run `rush web:dev`.
- For a module like `@lyvely/habits` run:
  - `rush run -t @lyvely/habits -s dev` to run the frontend.
  - `rush run -t @lyvely/habits-web -s dev` to run the backend.
:::

## Docker Installation

At the moment, there is no public docker image available. The [docker](https://github.com/buddh4/lyvely/tree/main/docker) directory includes
some examples including a `docker-compose` file with nginx, redis and mongodb with a local replica-set.
