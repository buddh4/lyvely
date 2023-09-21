# Permissions and Roles

Lyvely provides a highly flexible role based permission system.

> Note: The word `admin` in the following section is used for users with certain `admin.*` permissions. Those permissions
> are usually assigned to an admin group. The platform does not restrict you from assigning other roles with admin 
> related permissions or forces you to configure an admin group at all.

## Profile Roles and Permissions

- A profile contains multiple roles
- A role is assigned to multiple permissions
- A user can have multiple roles within a profile

### Default permissions

### Permission inheritance

Roles within a profile are automatically related with an **is a** relation to other roles e.g:
  
 { name: owner } * special role without record -> content.owner
 { name: admin } 
 is a { name: moderator }
 is a { name: member | friend }
 is a { name: follower }
 is a { name: user }
 is a { name: visitor }
 
The level is defined by the index and upper index roles automatically inherit permissions from all sub roles.

### Profile permissions

The following example shows a role tree example:

```javascript
[
  { name: 'owner', label:'Owner', permissions: ['*'], assignable: false, editable: false, deletable: false, extendable: false }, // has implicitely permission '*'
  { name: 'admin', permissions: ['admin.*'], assignable: true, editable: false, deletable: false, extendable: true },
  { name: 'moderator', permissions: ['content.*', 'comment.delete'], assignable: true, editable: false, deletable: false, extendable: true, sub: [
    { name: 'newsbot', permissions: ['content.post.*'], assignable: false, deletable: false, editable: false }
   ]},
 { name: 'member', types:['group'], permissions: ['content.*.create'], assignable: true, editable: false, deletable: false, extendable: true,
    super: [{ name: 'power-user', permissions: ['profile.group.invite']}],
    sub: [{ name: 'newbie', permissions: ['comment.create']}]
 },
 { name: 'friend', types:['user'], permissions: ['comment.create'], assignable: false, editable: false, deletable: false, extendable: true,
 { name: 'user', permissions: ['content.activities.*.view'] }, // Can access tasks/habits/goals views
 { name: 'visitor', visibility:['public'], permissions: ['content.stream.view'] } // Can access tasks/habits/goals views
]
```

**assignable**

This flag indicates users can manually be added to a role. The *owner* role for example can not be assigned to users
manually. Some roles may be managed outside the scope of the frontend or by other modules.

**editable**

The permissions and label of a role can only be edited manually if the role is editable. Some roles may be system defaults
and should not change.

**deletable**

Only roles with the deletable flag set to true can be deleted. This can also be used to force certain system roles into
the permission system.

**extendable**

Some roles may be flagged as extendable. This means admins are able to create **sub** or **super** roles for certain roles.
This can be useful for example to split the admin role into sub admin roles, in which certain users only have access to
certain admin sections. Another use-case would be the implementation of a user score system, in which a user can earn
permissions by creating content, or activity score etc. In the latter case you'd extend the *member* role with 
additional sub or super roles as for example *experienced_member*, *newbie*.

Another use-case would be adding permissions for bot-user roles.

Roles marked as extendable can be manually extended with **super** or **sub** roles as shown in the previous example.
Only **assignable** roles can be marked as extendable.

> Note: Sup or Super roles are not extendable themselves
> Note: A non-extendable role can have **super** or **sub** roles preconfigured.
> Note: Roles are only valid on public or protected profiles.

**special roles**

Some roles as the **owner**, **user** or **visitor** roles are special system roles, which can not be deleted or 
assigned manually and may even not be available in some profiles.

Example:

- The **owner** role is defined by `profile.owner` field and is not even part of the `profile.roles` settings.
- The **owner** role always has permission `*`, which includes permissions as `profile.archive`.
- The **user** role is only active in case of `profile.visibility = public | protected`
- The **visitor** role is only active in case of `profile.visibility = public` and active feature 
`user.visitor, profile.*.public`

### Read permissions

Content read permissions are not directly managed through permission strings, but rather through the role level of
a user.

Example:

A user creates a new content marked with `visibility:'moderator'`, which is visible for all members of the profile
with a moderator or higher role.

### Default roles and permissions

The set of default roles and default permissions depends on the configuration of a network. If no default configuration
is provided, the system defaults will be used. There are also pre-defined system defaults to choose from for different
use-cases.