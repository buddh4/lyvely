# Access Control Layer (ACL)

In this section we'll explore Lyvely's versatile methods for managing access to views and API endpoints. 

In Lyvely, you have the flexibility to enable restricted access for unauthenticated users, a feature that is accounted
for in the base access control layer (ACL). In addition, Lyvely provides a number of ACL-specific decorators that can 
be used by controllers to fine-tune access restrictions for users. We will also look at ACL-related route configurations 
used in the web layer and give you a comprehensive insight into managing access throughout your Lyvely features.

## API Access

### Visitor Strategy

The Lyvely backend can be configured to enable or disable restricted access for non-authenticated users, called visitors.
Access for visitors can be configured with the following configuration snippet:

```typescript
{
  //...
  visitorStrategy: {
      mode: VisitorMode.ENABLED,
      handles: ['welcome']
  }
  //...  
}
```

The `visitorStrategy` configuration provides support for two essential fields:

| Field     | Description                                                                                                                                                                 |
|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `mode`    | Set this field to `0` or `VisitorMode.Disabled` (default) to disable visitor access, or `1` or `VisitorMode.Enabled` to enable visitor access.                                    |
| `handles` | Use this field to specify the profile handles of profiles accessible to visitors. The first entry will be the default profile for visitors, while the others will be available for selection in the profile chooser. |

:::note
The profiles configured for visitors must be configured with the `visibility` level `VisibilityLevel.Visitor`.
:::

### Default Endpoint

When an API endpoint controller lacks any ACL-specific decorators, the global authentication guard will attempt to 
authenticate the user using a JWT token. If the guard doesn't detect a valid JWT token, it will then check if the 
visitor mode is enabled. If visitor mode is enabled, access will be granted not only to authenticated users but also 
to visitors.

Endpoints with stricter ACL requirements must be equipped with the corresponding decorators.

### `@Public` Endpoints

Public endpoints are endpoints that never require any kind of authentication, even if the visitor mode is disabled
such as the login or app-config endpoint. Public routes are marked with the `@Public` decorator at
Controller or Controller Function level.

:::warning
Endpoints decorated with `@Public` will skip the visitor mode configuration check.
:::

### The `@Visibility` Decorator

The `@Visibility` decorator can be used to restrict the access to an endpoint by defining one of the following 
visibility level restrictions:

| Level            | Description                                                                                    |
|------------------|------------------------------------------------------------------------------------------------|
| 0 (Members only) | Restricts the access to members only. (Only for profile controllers)                           |
| 1 (Organization) | Adds access for profile related organization members. (Only for profile controllers)           |
| 3 (User)         | Adds access for any authenticated users.                                                       |
| 4 (Visitors)     | Adds access for non-authenticated visitors, in case the visitor mode configuration is enabled. |


### `@Permissions` Decorator

The `@Permissions` decorator can be used to restrict controller access by permissions.

:::info
Please refer to the [Permissions Section](permissions.md) for more information.
:::

### `@Feature` Decorator

The `@Feature` decorator can be used to restrict controller access by feature switch.

:::info
Please refer to the [Features Section](features.md) for more information.
:::

### `@Policy` Decorator

The `@Policy` decorator can be used to restrict controller access by policies.

:::info
Please refer to the [Policies Section](policies.md) for more information.
:::

### Custom guards

If you have a specific use-case not covered by the decorators above you can also implement your own guards.

:::info
Please refer to the [NestJS Guards Guide](https://docs.nestjs.com/guards) for detailed information about implementing
custom access guards.
:::

## Web ACL

The access control layer (ACL) can be managed when defining routes or within the views itself as explained in the
following sections.

### `isPublic` Route Metadata

Similar to the `@Public` decorator in the backend you can define a public route in the frontend which will always be
accessible without requiring authentication by using the `isPublic` route metadata option.

### `visibility` Route Metadata

Similar to the `@Visibility` decorator in the backend you can restrict routes by defining a the visibility level of
a route.

## JWT guards