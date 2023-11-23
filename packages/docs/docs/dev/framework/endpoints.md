# Endpoints

In Lyvely, endpoint interfaces play a crucial role in defining the interactions between the web and api layer. 
These interfaces are part of the interface layer and encompass both the client interface used by the web layer
and endpoint interfaces used by controllers in the API layer.

Lyvely offers a set of helper functions designed to facilitate the creation of type-safe interface definitions, 
as detailed in this section.

## Client Interface & Endpoint Definition

To create an endpoint, we start with our client interface. In the example below, we demonstrate the use of 
the `StrictEndpoint` from the `@lyvely/interface` package. The `StrictEndpoint` enforces that the controller implements 
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
export const ENDPOINT_PING = 'ping';
```

## Repository Implementation

The repository's responsibility is to abstract away request-specific configuration, including but not limited to the 
request method, headers, or any other request-related settings.

```typescript title=interface/src/endpoints/ping.repository.ts
import { useApi } from '@lyvely/interface';
import { ENDPOINT_PINT, IPingClient } from './ping.endpoint.ts';

/**
 * The api object wraps an axio client and automatically attaches the given path to each request.
 * The generic type is used for the purpose of type-safety.
 */
const api = useApi<IPingClient>(ENDPOINT_PING);

export default {
    // With the generic type set to a function name of our client, we assure type-safety of the result.
    ping: async () => api.get<'ping'>()
}
```

:::note
If you prefer, you can also directly utilize the API within your client. However, it is advisable, especially for more 
intricate endpoints or when you need to configure specific request settings.
::::

## Client Implementation

The client is primarily used by the web layer in the following manner:

```typescript title=interface/src/endpoints/ping.client.ts
import repository from './ping.repository.ts';
import { IPingClient } from './ping.endpoint.ts';
import { unwrapAndTransformResponse } from '@lyvely/interface';
import { useSingleton } from '@lyvely/common';
import { PingResponse } from '../models';

export class PingClient implements IPingClient {
    async ping(): Promise<PingReponse> {
        // Here we unwrap the axios response and transform it to an instance of our model class.
        // If the request fails a ServiceException is thrown e.g. an UnauthorizedServiceException.
        return unwrapAndTransformResponse(repository.ping(), PingResponse);
    }   
}

export const usePingClient = useSingleton(() => new PingClient());
```

:::info
The `unwrapAndTransformResponse` is a helpful function that allows you to convert Axios responses into your model instances.
However, if your goal is to solely extract the response without performing any transformation, you can utilize the
`unwrapResponse`  function from the `@lyvely/interface` package. This can be particularly useful when working with interfaces 
instead of actual model classes.
:::

:::info
Your interface package should, at a minimum, export the client and endpoint interfaces for both the API and web layers.
:::

## Controller Implementation

The controller implements the `PingEndpoint`. In this example, our endpoint function does not have any arguments. 
However, if the endpoint function were to require an argument, you would need to define and provide the first argument when
implementing the function since we used the `StrictEndpoint` instead of the less restrictive `Endpoint` type.

```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '@/core';
import { ENDPOINT_PING, PingResponse, PingEndpoint } from 'my-ping-interface';

@Controller(ENDPOINT_PING)
export class PingController implements PingEndpoint {
  @Public()
  @Get()
  async ping(): Promise<PingResponse> {
    return new PingResponse({ ts: Date.now() });
  }
}
```

## Web Store

You can utilize our API client in various parts of your application, including views, components, composables, or stores,
in the following manner:

```typescript
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
    
    return {
        ping
    }
})
```
