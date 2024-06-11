# Controllers

Lyvely leverages [NestJS controllers](https://docs.nestjs.com/controllers) to handle API requests and provides additional 
utility decorators, which are covered in this guide. By using the following controller decorators you can specify the context
in which your controller handles requests and the access rules provided by the controller.

## `@GlobalController`

The `@GlobalController` decorator should be applied to any controller that does not handle requests within a profile 
context. It enhances access control by supporting global permissions.

### Guards

By default, a `@GlobalController` adds guards for supporting

 - `global permissions`: Check for global permissions of a user.
 - `custom guards`: Add custom controller guards.

You can add additional [guards](https://docs.nestjs.com/guards) with the `guards` options:

```typescript
// Defines a global controller with respons
@GlobalController('/my-route', { guards: [SomeGuard] })
export class MyController {}
```

### Global Request

The `@GlobalController` supports the following request types, depending on your access control rules:

- `OptionalUserRequest`: Use this request type for endpoints, which are accessible by users and visitors.
- `UserRequest`: Use this request type for endpoints with active ACL rules filtering out visitors.

The difference between these types is that the `OptionalUserRequest` includes an optional `user` property, whereas the
`UserRequest` includes a required `user` property, as illustrated in the following example:

```typescript
@GlobalController('/my-route')
export class MyController {
  @Get('rout-one')
  async routeOne(@Req() req: OptionaluserRequest) {
    // user may be undefined
    const { user } = req;
  }

  @Get('rout-two')
  @UserRoleAccess(UserRole.User)
  async routeOne(@Req() req: UserRequest) {
    // User will be defined
    const { user } = req;
  }
}
```

:::tip
See the [Access Control Guide](acl.md) for more information about how to restrict the access to your controllers.
:::

## `@ProfileController`

The `@ProfileController` decorator should be used for all profile-related controllers. Applying this decorator ensures 
that the request is a valid profile request, adds support for various profile access checks, and includes a 
`ProfileContext` in the controller request. A profile controller requires the presence of a valid `pid` or `handle´ 
query or parameter:

- `pid`: A valid profile id query or parameter.
- `handle`: A valid profile handle query or parameter.

### Guards

By default, a `@ProfileController` adds guards to support the following:

- `permissions`: Checks the user's permissions within this profile.
- `roles`: Verifies the user's role levels within the profile.
- `policies`: Ensures compliance with specific policies within the profile.
- `visibility`: Assesses the visibility level based on the user relationship.
- `custom guards`: Allows the addition of custom controller guards.

### Profile Request & Context

The `@ProfileController` supports the following request types, depending on your access control rules:

- `ProfileRequest`: A profile request with an optional `user` and `ProfileContext`.
- `ProtectedProfileRequest`: A profile request with a `user` and `ProtectedProfileContext` (no visitor access).
- `ProfileMembershipRequest`: A profile request of a valid member `user` and `ProfileMembershipContext`.

```typescript
@ProfileController('/p/:pid/my-profile-route')
export class MyController {
  @Get('rout-one')
  async routeOne(@Req() req: ProfileRequest) {
    // user may be undefined, profile is a valid profile and context will be of type ProfileContext
    const { user, profile, context } = req;
  }

  @Get('rout-two')
  @ProfileRoleAccess(ProfileRelationRole.User)
  async routeOne(@Req() req: ProtectedProfileRequest) {
    // user will be defined, profile is a valid profile and context will be of type ProtectedProfileContext
    const { user, profile, context } = req;
  }

  @Get('rout-three')
  @ProfileRoleAccess(ProfileRelationRole.Member)
  async routeOne(@Req() req: ProfileMembershipRequest) {
    // user will be defined and is a member of this profile, profile is a valid profile and context will be of type ProfileMembershipContext
    const { user, profile, context } = req;
  }
}
```
:::tip
See the [Access Control Guide](acl.md) for more information about how to restrict the access to your profile controllers.
:::

## `@ContentTypeController`

A `@ContentTypeController` extends the features of the `@ProfileController` by adding support for content-specific guards. 
A controller marked with this decorator includes content guards for endpoints using a `cid` parameter or query, as 
illustrated in the following example:

```typescript
@ContentTypeController('/p/:pid/my-content', MyContent)
export class MyContentController {
  
  // This endpoint does not use a :cid parameter, so the content access checks are skipped
  @Get()
  async getAll(@Req() req: ProfileRequest) {}

  // This endpoint uses a :cid param, so we verify all content guards
  @Get('/:cid/details')
  async details(@Req() req: ProfileContentRequest) { }
}
```

### Guards

By default, a `@ContentTypeController` adds guards to support the following:

- `permissions`: Checks the user's permissions within the profile and related content.
- `roles`: Verifies the user's role levels within the profile.
- `policies`:  Ensures compliance with specific policies within the profile, including content policies.
- `visibility`: Assesses the visibility level of the profile and content based on the user relationship.
- `content-type`: Restricts the context to a single type of content.
- `custom guards`: Allows the addition of custom controller guards.

### Profile Content Request & Context

You can use the following request types for your profile content controller, based on the endpoint's defined access rules:

- `ProfileContentRequest`: A profile request with an optional `user`, a valid `content` property and `ProfileContentContext`.
- `ProtectedProfileRequest`: A profile request with a `user`, a valid `content` property and  `ProtectedProfileContentContext` (no visitor access).
- `ProfileMemberContentRequest`: A profile request of a valid member `user`, a valid `content` property and `ProfileMembershipContentContext`.

```typescript
import { ProfileRoleAccess } from "./profile.role-access.decorator";

// With the second argument we restrict access to a specific type of content.
@ContentTypeController('/p/:pid/my-content', MyContent)
export class MyContentController {

  // This endpoint does not use a :cid parameter, so the content access checks are skipped.
  @Get()
  async getAll(@Req() req: ProfileRequest) {
    // req.content will be undefined
  }

  // This endpoint uses a :cid param, so we verify all content guards
  @Get('/:cid/details')
  async details(@Req() req: ProfileContentRequest) {
    // user may be undefined, but content will be a valid profile content
    const { user, content, context } = req;
  }

  // This endpoint uses a :cid param, so we verify all content guards
  @Get('/:cid/protected')
  @ProfileRoleAccess(ProfileRelationRole.User)
  async protected(@Req() req: ProtectedProfileContentRequest) {
    // user is defined, content will be a valid profile content
    const { user, content, context } = req;
  }

  // This endpoint uses a :cid param, so we verify all content guards
  @Get('/:cid/secret')
  @ProfileRoleAccess(ProfileRelationRole.Member)
  async secret(@Req() req: ProfileMemberContentRequest) {
    // user will be a valid member of the profile, content will be a valid profile content
  }
}
```

:::tip
See the [Access Control Guide](acl.md) for more information about how to restrict the access to your profile controllers.
:::

## Serialization

All controller types discussed in this guide will facilitate a [ClassSerializerInterceptor](https://docs.nestjs.com/techniques/serialization#overview) by default.
This means that an object returned by a controller endpoint will be transformed according to the
[class-transformer](https://github.com/typestack/class-transformer) rules of its type.

```typescript
// Defines a global controller with respons
@GlobalController('/my-route')
export class MyController {}
```

If you want to opt-out of response serialization, set the `serialize` option to `false` as in the following example.

```typescript
// Defines a global controller with respons
@GlobalController('/my-route', { serialize: false })
export class MyController {}
```
