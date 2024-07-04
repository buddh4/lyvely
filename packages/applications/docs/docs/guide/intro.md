---
---

# User Guide

Welcome to the Lyvely user guide! In this guide we will explore different features and discover common use cases of
the platform.

Lyvely is a versatile self-management and collaboration platform suitable for both individual and team usage and aims for
improving your ability to reach your goals and a healthy work-life balance.

While the guidelines provided are helpful, remember that they're not mandatory. Lyvely is designed with 
flexibility in mind, allowing you to adapt it to your preferences. Enjoy the freedom to use the platform in a way that 
suits you best. Let's start with a short overview of the main features of the platform.

:::note
As the platform is still in development, some minor features described in this guide may not yet be implemented or may 
only be experimental.
:::

## Profiles

Lyvely allows you to manage multiple profiles for any aspect of your live, be it for private or professional application.
A profile serves as a hub for users and content, offering a self-contained space with its own permission, feature
and visibility settings. There are three types of profiles:


- `User`: These profiles consist of a single member. A private user profile is automatically created once you
join the platform. Only the owner of the profile can create and manage content and other features within this type of profile. 
Users can create additional private or public user profiles for different aspects of their personal and professional lives.
- `Group`: A group profile offers collaborative features for your friends, family or colleagues. Create group profiles 
for projects, departments, teams or any other form of user space.
- `Organization`: Organization profiles can contain sub profiles of any kind and have a special set of content visibility
rules and permissions offering an additional level of organizing users and content. Platform administrators can manage 
who is allowed to create organization profiles.

Across different profiles, a user can choose different avatars, usernames, and emails to allow further separation between the 
use cases of their profiles. For example, for a profile used for university, you could choose your university email and 
a casual username, while for a work-related profile, you might choose your work email and real name and a professional photo.

## Users & Permissions

As mentioned in the last section, some profile types support multiple members which can be managed by the owner
or administrators of a profile. Each member is assigned with a specific **role** within the profile as well as optional 
**groups**. Both, the role and groups are used to manage **permissions** within a profile. Some permissions can also be 
granted to non-member users. There are the following user roles available:

- `Owners`: An owner of the profile, has special permissions as archiving the profile.
- `Admins`: Administrators are usually granted with most (but not all) permissions within a profile.
- `Moderators`: A moderator role can be assigned with extended permissions for managing users and content.
- `Members`: Normal members of the profile usually can create content and access most sections of a profile.
- `Guests`: A profile guest is a special kind of member, which may is granted with fewer permissions as normal members.
- `Organization`: Members of the same organization as a profile (but not the profile itself) may be granted more access 
than other users of the platform.
- `Follower`: Non-member users following a profile.
- `User`: Any other authenticated users without any relation to the profile.
- `Visitor`: If your Lyvely platform allows access for unauthenticated users, profiles can manage access permissions for visitors.

Permissions granted to a role are automatically granted to higher roles. This means that if we grant a certain permission
to the `members` role this permission will be granted for `members`, `moderators`, `admins`, `owners`.

More fine-grained permission management can be configured by creating custom user groups within a profile.

:::note
The `guest` and `follower` as well as `group management` feature is not yet implemented.
:::

## Profile Visibility

The visibility setting of a profile manages who can find and access a profile. It is possible to set the visibility level
of a profile to the following roles:

- `Member`: Members (including guest members) will always be able to see and access a profile, unless they are disabled.
- `Organization`: You may only want other organization members to see your profile.
- `Followers`: If the visibility level is set to follower, your profile can be searched, but is only accessible by followers.
- `User`: The profile is visible for any authenticated user.
- `Visitor`: The profile is also visible for non-authenticated users, in case this is allowed by the platform configuration.

:::note
The `follower` feature is not yet implemented.
:::

## Content

Almost anything in Lyvely consist of content like messages and other types of content. The main platform provides 
different types of content from simple messages to collaborative tasks, habits and journals. Each content can 
be further discussed by submitting sub-content entries within a content detail view. 

Most content share common features as:

- **Archive**: Archive content, so they do not appear in the stream and other views by default.
- **Visibility**: Manage the visibility of a content entry, so its only visible for certain roles within your profile.
- **Discussions**: Each content can be discussed in a sub discussion, unless locked.
- **Milestone**: If the milestone feature is active (default), you can add any type of content to a milestone which
  represent goals within your profile.
- **Tags**: By tagging content you can easily search and filter certain groups of content. Some modules may implement
  additional tag related features.

## Tags

Tags help you further categorize your content and are primarily used for filtering. Besides basic configurations such as
`name` and `color`, a tag can be configured to display tagged content `only on filter`. This setting excludes tagged content 
from some views (not the stream) unless a matching filter is active. For example, you can create categories in the tasks, 
like a shopping list, without cluttering the main view. This setting is useful for content that is only 
relevant infrequently.

The right choice of tags is important for organizing your content and effectively analyzing your progression.
Here are some examples of tags:

- `Health`: If your goal is a healthier lifestyle, you may create a general health tag for all activities or resources 
related to improving your health.
- `Family`: You can tag activities to distinguish how much effort you spend on different aspects of your life.
- `P:1`: In a project context, you may define priority or cost estimation tags.
- `Feat:Tasks`: In a project-related profile, you could create tags for different features.
- `Shopping`: Maintain a wishlist or shopping list.
- `Math`: Create tags by subject to easily filter all resources related to a school or university subject.

:::tip
The "Use cases" section contains further examples of the use of tags
:::

## Features

Within your profiles, you can enable, disable and configure a set of features to fit your use case. The available set
of features depends on the installed modules of the platform and its policies. Some platforms may only allow certain
features for certain profiles. A module may offer multiple features for fine-granular customization of a profile.

## Stream

The stream can be used to communicate with members or for brainstorming and information management. The stream will 
contain various types of content in a chat-like view. Each content entry supports multi-level 
sub-discussions consisting of streams themselves. This means you can not only create single-level, text-only comments
as with many other platforms, but rather add any kind of content to a discussion and sub-discussions.

Users can create any type of content directly in the stream view.