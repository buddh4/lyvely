# Endpoints

In Lyvely, endpoint interfaces play a crucial role in defining the interactions between the web and API layer. 
These interfaces are part of the interface layer of a feature and encompass both the client interface used by the web layer
and endpoint interfaces implemented by controllers in the API layer.

Lyvely offers a set of helper functions designed to facilitate the creation of type-safe interface definitions, 
as detailed in this section.

## Client Interface & Endpoint Definition

To create an endpoint, we start with our client interface. In the example below, we demonstrate the use of 
the `StrictEndpoint` from the `@lyvely/interface` package. The `StrictEndpoint` enforces the controller implementation to implement 
the first argument of each interface function. Typically, this argument is either a path parameter, such as the id of a 
document, or the request body.

However, if you don't want this strict enforcement, you have the option to use the `Endpoint` type instead. 
The `Endpoint` type ensures that the controller implements the interface but does not impose any restrictions regarding
the arguments of the functions.

```typescript title=interface/src/endpoints/ping.endpoint.ts
import { StrictEndpoint } from '@lyvely/interface';
import { PingResponse } from '../models';

export interface IPingClient {
    ping(): Promise<PingResponse>;
}

export type PingEndpoint = StrictEndpoint<IPingClient>;
export const API_PING = 'ping';
```

## Repository Implementation

The repository's responsibility is to abstract away request-specific configuration, including but not limited to the 
request method, headers, or any other request-related settings.

```typescript title=interface/src/endpoints/ping.repository.ts
import { useApi } from '@lyvely/interface';
import { API_PINT, IPingClient } from './ping.endpoint.ts';

/**
 * The API object wraps an axio client and automatically attaches the given path to each request.
 * The generic type is used for the purpose of type-safety.
 */
const api = useApi<IPingClient>(API_PING);

export default {
    // With the generic type set to a function name of our client, we assure type-safety of the result.
    ping: async () => api.get<'ping'>()
}
```

:::note
If you prefer, you can also omit the repository and directly utilize the `useApi` helper within your client. 
However, it is advisable to use this abstraction, especially for more intricate endpoints or when you need to configure
specific request settings.
:::

## Client Implementation

It is the responsibility of the client to call the API and transform the response to the expected result types, this
may include transforming the raw response to a model instance as in the following example:

```typescript title=interface/src/endpoints/ping.client.ts
import repository from './ping.repository.ts';
import { IPingClient } from './ping.endpoint.ts';
import { unwrapAndTransformResponse } from '@lyvely/interface';
import { useSingleton } from '@lyvely/common';
import { PingResponse } from '../models';

class PingClient implements IPingClient {
    async ping(): Promise<PingReponse> {
        /**
         * Here we unwrap the axios response and transform it to an instance of our model class.
         * If the request fails a ServiceException is thrown e.g. an UnauthorizedServiceException.
         */
        return unwrapAndTransformResponse(repository.ping(), PingResponse);
    }   
}

export const usePingClient = useSingleton(() => new PingClient());
```

:::info
The `unwrapAndTransformResponse` is a helper function that allows you to convert Axios responses into model instances.
However, if your goal is to solely extract the response without performing any transformation, you can utilize the
`unwrapResponse`  function from the `@lyvely/interface` package. This can be useful when working with interfaces 
instead of model classes.
:::

:::info
Your interface package should, at a minimum, **export the client and endpoint** interfaces for both the API and web layers.
:::

## Controller Implementation

The controller implements the `PingEndpoint` we defined in the interface layer. In this example, our endpoint function does not have any arguments. 
However, if the endpoint function were to require an argument, you would need to define the first argument when
implementing the function since we used the `StrictEndpoint` instead of the less restrictive `Endpoint` type.

```typescript title=api/src/controllers/ping.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Public } from '@/core';
import { API_PING, PingResponse, PingEndpoint } from 'my-ping-interface';

@Controller(API_PING)
export class PingController implements PingEndpoint {
  @Public()
  @Get()
  async ping(): Promise<PingResponse> {
    return new PingResponse({ ts: Date.now() });
  }
}
```

:::info
Please refer to the [NestJS Documentation](https://docs.nestjs.com/controllers) for more information about the implementation of
controller classes.
:::

## Client Usage

You can utilize the API client in various parts of your application, including views, components, composables, or stores,
in the following manner:

```typescript title=web/src/stores/ping.store.ts
import { defineStore } from "pinia";
import { usePingClient } from "my-ping-interface";

export const pingStore = defineStore('ping', () => {
  async function ping() {
    try {
      return await usePingClient().ping()
    } catch(e) {
      // Handle error
    }
  }
    
  return { ping };
})
```

## Profile Endpoints

Endpoint paths for profile features will most likely start with a `profiles/:pid` prefix. 
This prefix is essential when working with APIs on profile level especially when using the profile access control layer.
To define an endpoint path with this prefix, you can utilize the `profileApiPrefix` helper function, as demonstrated below:

```typescript title=interface/src/endpoints/ping.endpoint.ts
import {profileApiPrefix} from "@lyvely/interface";

export const API_POLLS = profileApiPrefix('polls');
//...
```

The example above defines an endpoint prefix as `profiles/:pid/polls`.
In our web application, there is an interceptor that automatically sets the `pid` of the currently active profile by 
default. However, users of the client can also manually set a `pid` when calling the client with an option of
type `IProfileApiRequestOption`. You can see an example of this manual pid setting in the following code snippets:


```typescript title=interface/src/endpoints/polls.client.ts
import repository from './ping.repository.ts';
import { IPollsClient } from './polls.endpoint.ts';
import { unwrapAndTransformResponse } from '@lyvely/interface';
import { useSingleton } from '@lyvely/common';
import { PollsResponse } from '../models';
import { IProfileApiRequestOptions } from '@/endpoints';

class PollsClient implements IPollsClient {
    async getPolls(options?: IProfileApiRequestOptions): Promise<PollsResponse> {
        return unwrapAndTransformResponse(repository.ping(options), PollsResponse);
    }   
    //...
}

export const usePollsClient = useSingleton(() => new PollsClient());
```

```typescript title=interface/src/endpoints/polls.repository.ts
import { useApi } from '@lyvely/interface';
import { API_POLLS, IPollsClient } from './polls.endpoint.ts';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<IPollsClient>(ENDPOINT_POLLS);

export default {
    // With the generic type set to a function name of our client, we assure type-safety of the result.
    getPolls: async (options?: IProfileApiRequestOptions) => api.get<'getPolls'>(options)
}
```

```typescript title=web/src/endpoints/polls.store.ts
import { defineStore } from "pinia";
import { usePolls } from "polls-interface";

export const pingStore = defineStore('polls', () => {
    async function getPolls(pid: string) {
        try {
            return await usePollsClient().getPolls({ pid });
        } catch(e) {
            // Handle error
        }
    }

    return { getPolls };
})
```

:::note
Manually setting the `pid` of an api request is only required for cross profile requests or when using the client 
outside the web application.
:::

## API Versioning

Lyvely employs a robust API versioning strategy to ensure backward compatibility and a seamless evolution of services.
To manage the versions of APIs, we utilize 
a [custom request header](https://docs.nestjs.com/techniques/versioning#header-versioning-type): `x-api-version`.

When making API requests, clients should specify the desired API version using the `x-api-version` header.
This header accepts a version string that indicates the version of the API you wish to interact with.

:::info
The version of an api client is defined when calling the `useApi` helper in the interface layer as described 
in a section below. Therefore, consumer of api clients in the web layer do not have to care about the api version.
:::

#### Modular API Versioning

Lyvely’s API architecture is designed with modularity in mind, where each module, or even individual endpoints within a 
module, may have its own versioning lifecycle. This design allows for targeted updates and granular control over the 
API’s evolution.

#### Versioning Strategy:

We adhere to [Semantic Versioning (SemVer)](https://semver.org/) principles, ensuring that version increments 
signal the nature of changes to clients. A major version must be incremented when there are changes that could 
potentially break backward compatibility with the existing client integrations. 

Examples of such changes include:

  - Introducing new required fields in API requests or responses.
  - Modifying the existing schema of your Data Transfer Objects (DTOs).
  - Removing or renaming existing API endpoints or fields.


#### Example:

The following example illustrates the implementation of a versioned endpoint.

```typescript title=interface/src/endpoints/polls.repository.ts
import { useApi } from '@lyvely/interface';
import { ENDPOINT_POLLS, IPollsClient } from './polls.endpoint.ts';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<IPollsClient>(ENDPOINT_POLLS, '2');

export default {
    // With the generic type set to a function name of our client, we assure type-safety of the result.
    getPolls: async (options?: IProfileApiRequestOptions) => api.get<'getPolls'>(options)
}
```

```typescript title=api/src/controllers/polls.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ENDPOINT_POLLS, PollsResponse, PollsEndpoint } from 'polls-interface';

@Controller({
    path: ENDPOINT_POLLS,
    version: '2'
})
export class PollsController implements PingEndpoint {
  //...
}
```

:::note
The NestJS versioning enables a controller to support multiple version. Please refer to the
[NestJs Versioning Guide](https://docs.nestjs.com/techniques/versioning#versioning) for more examples.
:::

:::info
Lyvely uses the NestJS `NEUTRAL_VERSION` as default version for its controllers, which means you are not required to
define a version for your controller.
:::

