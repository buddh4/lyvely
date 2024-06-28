# Permissions

Lyvely provides a comprehensive permissions system that encompasses three distinct types of permissions:

- **Global Permissions:** These permissions apply across the entire platform and are not associated with any specific profile.
- **Profile Permissions:** These permissions define what actions users can perform within a specific profile.
- **User Permissions:** These permissions regulate interactions and access between individual users.

## Overview

The permission system is primarily designed to govern access control for various resources. It accomplishes this by 
evaluating the permissions granted to a `PermissionSubject`, such as a user, in relation to a `PermissionObject`, 
which could be a profile, another user or the platform itself. The evaluation process involves checking the 
`PermissionSettings` associated with the `PermissionObject` for a given permission. If no specific settings exist for a 
particular permission, the permission system then examines the system-wide configuration and, as a last resort, 
falls back to the default permission definition.

Lyvely's permissions system offers flexibility by allowing permissions to be granted to both roles and user groups. 
Permission roles are organized hierarchically, with lower-level roles inheriting permissions from higher-level roles. 
Each type of permission has its own set of roles and user groups, which are elaborated upon in the subsequent section.

This permission system is designed to make it easy and intuitive to configure permissions using role-based settings while 
offering extended flexibility through optional user groups. It unifies permission management across all permission types, 
streamlining the process.

## Permission Definition

Permissions are typically defined within the interface package of a module. Each permission implements the 
`IPermission` interface, which supports the following properties:

| Field         | Description                                                                            |
|---------------|----------------------------------------------------------------------------------------|
| `id`          | A unique permission ID, often prefixed with the module ID.                             |
| `moduleId`    | The ID of the module exporting the permission.                                         |
| `type`        | The type of permission, such as `BasePermissionType.Profile`                           |
| `name`        | A translatable permission name used in the frontend.                                   |
| `description` | A translatable permission description used in the frontend.                            |
| `default`     | The default role assigned to this permission, subject to configuration overrides.      |
| `min`         | The minimum role to which this permission is granted, e.g. `ProfileRelationRole.Admin` |
| `max`         | The maximum role that can be granted this permission, e.g. `ProfileRelationRole.User`  |

#### Example:

Let's take a practical example to illustrate how permissions work. We'll define a `CreatePollsPermission`, which has 
specific constraints:

```typescript title=packages/interfaces/permissions/create-polls.permission.ts
export const CreatePollsPermission: IProfilePermission = {
  id: 'polls.create-poll',
  moduleId: POLLS_MODULE_ID,
  name: 'polls.permissions.create.name',
  description: 'polls.permissions.create.description',
  type: BasePermissionType.Profile,
  default: ProfileRelationRole.Member,
  min: ProfileRelationRole.Moderator,
  max: ProfileRelationRole.User,
};
```

In this example, we defined a `CreatePollsPermission` that must be assigned to the role level `Moderator` at a minimum 
and can be assigned up to the role level `User`. By default, each `Member` role has this permission, allowing them to 
create polls. The `max` restriction was chosen in this example because `Visitor` roles are not allowed to create content.

## Permission Registry

To make a permission functional within your Lyvely application, you must register it. This registration process is 
handled internally through the `registerPermissions` function found in the `@lyvely/interfaces` package. 
When developing your frontend or backend modules, you can export permissions directly, as demonstrated below:

##### Backend:

```typescript title=packages/api/src/polls.module.ts
@LyvelyModule({
  id: POLLS_MODULE_ID,
  permissions: [CreatePollsPermission],
  // Other options...
})
export class MyModule {}
```

##### Frontend:

```typescript title=packages/web/src/module.ts
export default () => ({
  id: POLLS_MODULE_ID,
  permissions: [CreatePollsPermission],
    // Other options...
})
```

## Configuring Permissions

As long as a particular permission is not overridden, the permission check will fall back to the default permission 
configuration. The permission configuration provides the ability to override the default permission role and set default
groups for a permission:

```typescript title=lyvely.config.ts
export default {
  // Other options...
  permissions: {
    defaults: [
      { id: CreatePollsPermission.id, role: BasePermissionRole.Moderator },
    ]
  }
}
```

:::info
The permission configuration is included in the AppConfig sent to the client, enabling frontend permission checks 
without the need to consult the backend.
:::

## Permission Settings

Each permission type offers its own mechanism for overriding default and configured values. For instance, profile-level 
permission settings are utilized to define permission settings that are directly stored within the profile document.

## Global Permissions

Global permissions encompass platform-wide user permissions and are associated with the following roles:


| Role          | Description                          |
|---------------|--------------------------------------|
| **Admin**     | Global platform admin.               |
| **Moderator** | Global platform moderator.           |
| **User**      | Any "normal" authenticated user.     |
| **Visitor**   | Non-authenticated platform visitor.  |

#### Verify Global Permissions

#### Backend:

To manually verify a global permission in the backend, you can use the `GlobalPermissionsService` as demonstrated below:

```typescript
import {GlobalPermissionsService} from "@lyvely/api";

@Injectable()
export class MyService {
  constructor(private readonly globalPermissionsService: GlobalPermissionsService);
  
  public checKPermission(user: OptionalUser) {
    return this.globalPermissionsService.verifyPermission(user, MyGLobalPermission.id)
  }
}
```

:::tip
For checking multiple permissions simultaneously, consider using the `verifyEveryPermission` or `verifyAnyPermission`
functions provided by the `GlobalPermissionsService`.
:::

In most cases, permission checks in the backend will be integrated into the access control of your controller. To 
accomplish this, you can employ the `@Permissions` decorator, which can be used at both the controller class and 
controller function levels:

```typescript
@Controller(API_MY_MODULE)
@Permissions(MyGLobalPermission.id, AnotherGLobalPermission.id)
export class MyModuleController {
  //...
}
```

#### Frontend:

In the frontend you can make use of the `useGlobalPermissions` composable for reactive permission checks:

```html
<script lang="ts" setup>
    const { isAllowed } = useGlobalPermissions(PermissionA, PermissionB);
</script>
```
