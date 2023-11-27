# Testing

## Run Test Environment

When working on the Lyvely core platform or implementing a feature, you can effortlessly set up a testing environment
by launching both the web and API servers. The test API will be accessible at `127.0.0.1:8080`, and the web server will
be active at `127.0.0.1:3000`.

### Core Development

When working on the core platform, you can start the web- and api-server by executing the following commands in your
terminal:

```shell
npm run dev -w @lyvely/web
```

```shell
npm run dev -w @lyvely/api
```

### Feature Development

When developing a feature, you can initiate the web and server packages by executing the following commands in your
terminal:

```shell
npm run dev -w my-module-web;
```

```shell
npm run dev -w my-module-api;
```

These commands setup establishes your testing environment, with the API running on `127.0.0.1:8080` 
and the web server on `127.0.0.1:3000`.

:::note
Please note that the test environment uses `127.0.0.1` instead of `localhost`. This choice is made because some modern web
browsers, such as Chrome, may reject setting cookies if the backend operates on a different localhost port.
:::

By adhering to this organizational approach, you can efficiently manage your custom modules, ensuring both code
reusability and type-safety across your frontend and backend components. This approach can also help you streamline
your development and testing processes for smoother and more effective software development.
