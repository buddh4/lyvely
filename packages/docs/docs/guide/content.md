# Content

## Content Policies

Content policies are designed to regulate user access to various content features on the platform. 
This section provides an overview of the default content policies. It's important to note that these policies can 
vary depending on the type of content and may be overridden by platform administrators as needed.

### Content Manage Policy

The `ContentManagePolicy` is designed to provide extensive content management capabilities. It encompasses a broad 
spectrum of access rights, including but not limited to writing, deleting, transforming, and the ability to assign 
users and tags to content. This policy is versatile and often operates as a fallback policy for other policies, which 
will be detailed in subsequent sections of this documentation.

For the majority of content types, the following rules are applicable:

- **Permission**: In case the content type provides a manage permission, it is used for granting access, 
other checks will be skipped.
- **Manager Assignment**:
  - If managers are assigned to the content, these users are granted with the `ContentManagePolicy`.
  - In cases where no manager is assigned, the content author automatically receives this policy.
- **Default Roles**: Profile Owners and Administrators as well as Moderators are inherently granted the 
`ContentManagePolicy` (if not restricted by permissions).

### Content Write Policy

The `ContentWritePolicy` regulates access to writing the main content of a content entry. This policy is applicable 
under the following conditions:

By default, a content can be written if:

- The content is **not locked**.
- The content type is **editable**.
- The user has a content type-specific permission or the `ContentManagePolicy`.

:::note
The `ContentWritePolicy` is designed to govern the ability to write and edit the main body of a content 
entry. This policy focuses exclusively on the content itself, rather than its associated metadata.
:::

### Content Delete Policy

The `ContentDeletePolicy` oversees the permissions for deleting, archiving, and restoring content.

A content entry can be deleted or archived if:

- The content type is **deletable**.
- The user holds a content type-specific deletion permission or the `ContentManagePolicy`.

### Content Read Policy

The `ContentReadPolicy` governs the read access to content. This access is typically determined by the `visibility`
level of a content entry, which aligns with specific roles:

| Role             | Description                                      |
|------------------|--------------------------------------------------|
| **Owners**       | Owners of the profile                            |
| **Admins**       | Administrators of the profile                    |
| **Moderators**   | Profile moderators                               |
| **Members**      | Profile members                                  |
| **Guests**       | Profile guest members                            |
| **Organization** | Members of the organization a profile belongs to |
| **Follower**     | Profile followers                                |
| **User**         | Authenticated users not part of the profile      |
| **Visitor**      | Unauthenticated users                            |

:::note
Depending on the global and profile configuration, some of the roles may not be available when 
configuring the visibility of content. For example, if the platform does not allow visitors or the profile is not 
visible for visitors, the `Visitor` role won't be available.
:::

### Content Create Policy

A `ContentCreatePolicy` is distinctively designed to manage content creation permissions, not on an individual content 
basis, but at the content type level. This approach ensures a content type specific governance of content creation.

Each content type typically has its own unique creation permission. This specialized permission is integral in 
regulating access to content creation endpoints within that content type.

