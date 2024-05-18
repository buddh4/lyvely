[ ] Update package manager
[ ] Install git
[ ] Install node with npm (https://github.com/nodesource/distributions)
[ ] Install docker
[ ] Install docker-compose

# Build and run with Docker

The `docker` directory includes various Dockerfiles and a `docker-compose.yml` file, which can be utilized for test 
and staging environments or serve as templates for your own Docker-based setups. The following sections outline 
the different configurations.

## Setup

In this section we will use the `docker/docker-util.sh` script to create a server and web configuration which will
be used in our docker image.

#### 1. Clone Repository

First we need to clone our repository and enter the root directory:

```shell
git clone git@github.com:buddh4/lyvely.git
cd lyvely
```

#### 2. Configuration

In the next step we create the `docker/.env` file which contains basic server and web configurations for our
images:

```shell
cp docker/.env.dist docker/.env
```

Align the configuration variables within `.env` to your needs and then run the following command to create our
configuration files:

```
sh docker/docker-compose-setup.sh -f
```

Running this command will create the following files
- `docker/config/lyvely.ts`: Api configuration file
- `docker/config/web.env`: Frontend environment configuration
- `docker/config/ncinx.conf`: Nginx configuration, used for `Dockerfile.nginx` container

#### 3. Review

Review and align the `docker/config/lyvely.ts` and `docker/config/web.env` configuration files, since those will
be used within your docker images.

## Build a Static Serve Image

The `Dockerfile.static` facilitates the creation of a Docker image that hosts both the Lyvely API and frontend. 
In this setup, the backend serves the frontend.

```
docker buildx build -t lyvely:latest -f docker/Dockerfile.static .
```

#### 5. Run Lyvely Container

```
docker run --user lyvely:lyvely -d --log-driver=json-file --log-opt max-size=10m --log-opt max-file=3 --log-opt labels=lyvely --name lyvely lyvely:latest
```

**Check logs**

```
docker logs --since 2022-05-01 lyvely
```

## Docker Compose

This setup will build a whole Lyvely docker environment including Redis, MongoDB and Nginx using 
[Docker Compose](https://docs.docker.com/compose/). 

:::warning
Note, this will run all servers on a single node, which is not recommended for production environments.
:::

This setup requires Docker Compose to be installed. You can check if it is already available by running:

```shell
docker-compose --version
```

#### 1. Setup .env file

```shell
cp docker/.env.dist .env
```

Configure your environment variables in `.env` file

#### 2. Run setup script

```
sh ./docker-compose-setup.sh -fbu
```

This command will:

 - Creates a `data` directories for mongo and redis 
 - Create users for the different services:
   - **lyvely**
   - **mongo**
   - **redis**
   - **nginx**
 - Create the configuration files:
     - `docker/config/lyvely.ts` which is your backend configuration
     - `docker/config/nginx.conf` which will be used by the nginx container
     - `packages/web/.env` which was used to build your static web files
 - Build the common package
 - Build the web package

In case you need to change some entries in packages/web/.env you'll need to manually rebuild the web project by running
`npm run web:build` in the projects root directory.

Running this script again will only build the common and web project unless you add the `-f` flag, which will force
the configurations to be overwritten.

Running the script without the `-b` flag will prevent the common and web project from being build.

#### 3. Review configuration files

Review your configuration files:

  - `docker/config/lyvely.ts`
  - `docker/config/nginx.conf`
  - `packages/web/.env` (changes to this file require a rebuild)

For a local test installation, you probably want to align the configuration files to allow http only access.
You may want to use the following mail configuration for a local test environment:

```
mail: {
    transport: {
      streamTransport: true,
    },
    preview: {
      dir: `${process.cwd()}/mail/messages/test`,
      open: true,
    },
  }
```

See https://nodemailer.com/smtp/ for more information about available mail server settings.

#### 5. Copy certificates

Copy your ssh certificate and key file into `docker/certs`:

 - `docker/certs/lyvely.app.crt` 
 - `docker/certs/lyvely.app.key` 

#### 4. Run docker compose

```
sudo docker compose up --build -d
```




## Enable ports

sudo ufw allow 80
sudo ufw allow 443
