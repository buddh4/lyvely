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
  modules: {
    permissions: {
      visitorStrategy: {
        mode: VisitorMode.ENABLED,
          handles: ['welcome']
      }
    }
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

### `@GlobalController`

This decorator should be used for non profile related controllers and adds support for global permission check using
the `@Permissions` decorator.

### `@ProfileController`

This decorator should be used for all profile related controllers. Using this decorator will ensure that the request is
a valid profile request and adds support for various profile access checks and adds a `ProfileContext` to the controller 
request. You can use the following request types for your controller, depending
on the defined access rules of your endpoint:

- `ProfileRequest`: A profile request with an optional `user` and `ProfileContext` in case of visitor access.
- `ProtectedProfileRequest`: A profile request with a `user` and `ProtectedProfileRequest` (no visitor access).
- `ProfileMembershipRequest`: A profile request of a valid member `user` and `ProfileMembershipRequest`.

### `@ContentTypeController`

This decorator should be used for all profile content related controllers. Using this decorator will ensure that the 
request is a valid profile content request and adds support for various content related access checks as content type 
and content. You can use the following request types for your controller, depending on the defined access rules of 
your endpoint:

- `ProfileContentRequest`: A profile request with an optional `user` and `ProfileContext` in case of visitor access.
- `ProtectedProfileRequest`: A profile request with a `user` and `ProtectedProfileRequest` (no visitor access).
- `MemberProfileContentRequest`: A profile request of a valid member `user` and `MembershipProfileContentContext`.

### `@Public` Endpoints

Public endpoints are endpoints that never require any kind of authentication, even if the visitor mode is disabled
such as the login or app-config endpoint. Public routes are marked with the `@Public` decorator at
Controller or Controller Function level.

:::warning
Endpoints decorated with `@Public` will skip the visitor mode configuration check.
:::

:::tip
You may want to use the `@Public` decorator in some cases when using custom [JWT guards](#jwt) and you need to skip
the default jwt authentication.
:::

### `@ProfileEndpoint` Decorator

The `@ProfileEndpoint` can be used to add profile guard support on `@GlobalController` controller functions. This may be used
if you need to mix global and profile controller logic within a single controller. Note mixing global and profile context
is usually not recommended since it increases the complexity of your controller and therefore is prone to errors.

### `@UserRoleAccess` Decorator

The `@UserRoleAccess` decorator can be used to restrict the access to an endpoint by defining one of the following
user roles levels, which will grant access for the given role and all roles above:

| Level     | Description                                                     |
|-----------|-----------------------------------------------------------------|
| Admin     | Restricts the access global admin users.                        |
| Moderator | Adds access for user with global moderator role.                |
| User      | Adds access for any active user.                                |
| Visitor   | Grants access for all users and platform visitors (if enabled). |

### `@UserStatusAccess` Decorator

The `@UserStatusAccess` decorator can be used to restrict the access to an endpoint by defining one of the following
user statuses. If no such decorator is defined we only allow access of authenticated users with an `active` status and skip
this check for visitor users. In order to skip this check and allow any user status use `@UserStatusAccess(true)`.

| Status            | Description                       |
|-------------------|-----------------------------------|
| Disabled          | A disabled user.                  |
| Active            | An active user (default).         |
| EmailVerification | User awaiting email verification. |
| Locked            | A temporarily locked user.        |

### The `@ProfileRoleAccess` Decorator

The `@ProfileRoleAccess` decorator can be used to restrict the access to an endpoint by defining one of the following 
profile roles levels, which will grant access for the given role and all roles above.

:::note
This decorator is only valid on controllers marked with a `@ProfileController` instead.
:::

| Level        | Description                                                     |
|--------------|-----------------------------------------------------------------|
| Owner        | Restricts the access to the profile owner only.                 |
| Admin        | Adds access for user with admin role.                           |
| Moderator    | Adds access for user with moderator role.                       |
| Member       | Adds access for any profile member.                             |
| Guest        | Adds access for profile guest user.                             |
| Organization | Adds access for any member of the related organization.         |
| Follower     | Adds access for users following the profile.                    |
| User         | Adds access for any active user of the platform.                |
| Visitor      | Grants access for all users and platform visitors (if enabled). |

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

## Web access

The access control layer (ACL) can be managed when defining routes or within the views itself as explained in the
following sections.

:::warning
While you can hide UI elements or limit access to routes for specific user types in the frontend, it's crucial to
emphasize that real access control should be enforced in the backend.
:::

### `isPublic` Route Metadata

Much like the `@Public` decorator in the backend, you have the ability to mark a web route as public by setting the
route metadata `isPublic` to `true`. This means that the route will always be accessible without the need for 
authentication and ignoring the `visitorMode` configuration. This is for example required for routes 
like **login**, **sign-up** or **forgot-password**.

### `visibility` Route Metadata

Much like the `@Visibility` decorator used in the backend, you can control route access in the frontend by specifying 
the visibility level of a route. You achieve this by setting the `visibility` metadata option to one of the valid 
visibility levels:

- `0` or `VisibilityLevel.Member`: This restricts access to profile members only.
- `1` or `VisibilityLevel.Organization`: Access is granted to members and members of the organization.
- `2` or `VisibilityLevel.User`: Access is extended to all authenticated users on the platform.
- `3` or `VisibilityLevel.Visitor`:  Access is granted to visitors as well, but this depends on whether `visitorMode`  is enabled.

### `permissions` Route Metadata

For even more granular control over access, you can employ the `permissions` route metadata setting. 
This allows you to restrict access to routes based on specific permissions user permissions.

### ´v-if-feature´ directive

The `v-if-feature` directive can be used to show or hide ui elements depending on feature switches. In case of profile
features the directive checks against active features of the currently active profile. 

```html
<template>
    <div v-if-feature="'polls'">
        <!-- This content will only be rendered if the polls feature is active on the current profile. -->
    </div>
</template>
```

In the following example we check for multiple features on a component:

```html
```html
<template>
    <!-- This button will only be rendered if both sub features are active on the current profile. -->
    <ly-button v-if-feature="['polls.subfeature1', 'polls.subfeature2']" />
</template>
```

### ´v-if-permission´ directive

The `v-if-permission` directive is designed to dynamically display or hide UI elements based on specific permissions. 
When it comes to profile permissions, this directive verifies the permission settings associated with the currently
active profile.

:::warning
This directive currently should only be used for plain html elements and not component due to the fact that components
with multiple root elements do not support custom directives in vue. Therefore, its currently not supported
on components  like `<ly-button>`.  In such cases use `useProfileStore().verifyPermissions()` instead.
:::

## JWT

In certain cases, security requirements may demand the implementation of custom JWT-based access guards. To address 
this need, Lyvely provides support for a basic `JwtStrategy` within the `@lyvely/api` package.

### Implementing a Custom JWT Strategy

Below is an example demonstrating the creation of a custom JWT guard to manage access for a "reset password" endpoint:

```typescript title=api/src/guards/strategies/jwt-reset-password.strategy.ts
export const JWT_RESET_PASSWORD_TOKEN = 'password-reset';

@Injectable()
export class JwtResetPasswordStrategy extends JwtStrategy<JwtTokenPayloadIF>({
    name: JWT_RESET_PASSWORD_TOKEN,
    // The options function can be used to overwrite the default jwt verification options.
    options: (configService) => {
        return {
            secretOrKey: configService.get('auth.jwt.verify.secret'),
            jwtFromRequest: ExtractJwt.fromBodyField('token'),
        };
    },
}) {
    constructor(protected configService: ConfigService<ConfigurationPath>) {
        super(configService);
    }

    override async validateUser(user, req, payload) {
       if (user.passwordResetAt && user.passwordResetAt > getIssuedAt(payload)) {
            throw new UnauthorizedException();
        }
    }
}
```

A JWT strategy expects, at a minimum, the following payload properties:

- `purpose`: This identifies the unique purpose of each JWT strategy to distinguish JWT tokens. 
It's defined by default by the `name` or more specific the `purpose` option.
- `sub`: This represents the user ID used to identify the associated user.

Additional fields can be validated within the custom `validateUser` template function.

:::note
The `auth.jwt.verify.secret` will be used by default and could be omitted in our `options` function.
:::

:::note
By default, disabled users are blocked, and tokens issued before the `sessionResetAt` user property are invalidated.
:::

### Implementing a Custom JWT Guard

We can now create a corresponding guard for our password reset strategy as follows:

```typescript
@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_RESET_PASSWORD_TOKEN) {}
```

### Using a Custom JWT Guard

Now, we can assign our newly created guard to a controller, or as shown in the following example, to a controller 
function:

```typescript
@Controller(API_RESET_PASSWORD)
@UseClassSerializer()
export class ResetPasswordController implements ResetPasswordEndpoint {
    constructor(private resetPasswordService: ResetPasswordService) {}

    @Public()
    @Post()
    @UseGuards(JwtResetPasswordGuard)
    async resetPassword(@Body() model: ResetPassword, @Req() req: UserRequest) {
        await this.resetPasswordService.resetPassword(req.user, model.password);
    }
    
    //...
}
```

### Issuing a JWT

To generate a new JWT for a user, we must sign the token, as demonstrated in the following code snippet:

```typescript
function createResetPasswordToken(user: User): string {
    const options: JwtSignOptions = {
        secret: this.configService.get('auth.jwt.verify.secret'),
        expiresIn: '3h',
        algorithm: 'HS256',
    };
    
    const issuer = this.configService.get('auth.jwt.issuer');
    if (issuer) options.issuer = issuer;
    
    return this.jwtService.sign(
        { sub: user._id.toString(), purpose: JWT_RESET_PASSWORD_TOKEN },
        options,
    );
}
```

You can now transmit the token to the user, either by using it as a cookie or including it in an API response.
