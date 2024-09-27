# Testing

When working on the Lyvely core platform or implementing a feature, you can effortlessly set up a testing environment
by launching both the web and API servers. The test API will be accessible at `127.0.0.1:8080`, and the web server will
be active at `127.0.0.1:3000`.

## Core Development

For testing the web or pwa packages there are convenient ways of starting a web server:

- `rush web`: Runs a test web server for the core web package.
- `rush pwa`: Runs a test web server for the pwa application, which includes all features.

For testing the api or server packages there are convenient ways of starting a web server:

- `rush api`: Runs the api on `127.0.0.1:8080`.
- `rush api:debug`: Runs the api in debug mode on `127.0.0.1:8080`.
- `rush server`: Runs server application including all features on `127.0.0.1:8080`.
- `rush server:debug`: Runs server application including all features in debug mode on `127.0.0.1:8080`.

## Web Testing

To initiate the test environment for a `web` package, run the `rush -t <web-package> -s dev` command.
This will launch a Lyvely test web server with default test configuration on `127.0.0.1:3000`.

:::note
Please note that the test environment uses `127.0.0.1` instead of `localhost`. This choice is made because some modern web
browsers, such as Chrome, may reject setting cookies if the backend operates on a different localhost port.
:::

## API Testing

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

## E2E Testing

Lyvely uses [Cypress.io] for end-to-end testing and provides many additional cypress plugins and fixtures for convenient
test development.

:::warning
This documentation is under construction, please refer to the [Lyvely repository](https://github.com/buddh4/lyvely)
for examples.
:::
