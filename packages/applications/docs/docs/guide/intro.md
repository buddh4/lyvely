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
join the platform. Only the owner of the profile can create and manage content and other features within the profile. 
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

As mentioned in the last section, some types of profile support multiple members which can be managed by the owner
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

- `Healt`: If your goal is a healthier lifestyle, you may create a general health tag for all activities or resources 
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

### Stream

The stream can be used to communicate with members or for brainstorming and information management. The stream will 
contain various types of content in a chat-like view. Each content entry supports multi-level 
sub-discussions consisting of streams themselves. This means you can not only create single-level, text-only comments
as with many other platforms, but rather add any kind of content to a discussion and sub-discussions.

Users can create any type of content directly in the stream view.

### Habits

With the Habits feature, you can keep track of recurring activities within a profile. A habit can be configured with the
following options:

- **Title**: The content title.
- **Description**: A detailed description of the habit.
- **Interval**: The interval of the habit e.g. Day, Week, Month (see below).
- **Min Value**: The minimum of units you plan to complete the habit within the interval.
- **Optimal Value**: The optimal amount of units you plan to complete the habit within the interval.
- **Max Value**: The max amount of units you plan to complete the habit within the interval.
- **Score**: Choose a score, which reflects the effort and priority of a habit.
- **User Strategy**: A habit can be configured as `per-user` or `shared` for personal or collaborative habit management.
- **Input Type**: The type of input used to keep track of our habit.
  - `Checkboxes`: A checkbox list limited to 1-8 checkboxes.
  - `Spinner`: Manual number input with spinner buttons.
  - `Range`: A range input slider.
  - `Timer`: A timer input with play/pause button and manual input capabilities.

Habits are managed within a calendar-plan view, which separates habits in one of the following intervals:

- `Daily`: A habit which I should be done once or multiple times a day. 
  - I want drink at least 2 litre a day (split into 4 units).
  - I want to wake up at 8:00 AM each day.
- `Weekly`:  A habit which I should be done once or multiple times a week.
  - I want to do sports at least twice a week, but optimal three times and max 5 times.
- `Monthly`:  A habit which I should be done once or multiple times a month.
  - Once a month our team wants to do at least a team event.
- `Quarterly`:  A habit which I should be done once or multiple times a quarter.
  - Once a quarter our department should perform a goal assessment for long-term goals. 
- `Yearly`:  A habit which I should be done once or multiple times a year.
  - I want to do a general health check once a year.
- `Unscheduled`: A habit which is not scheduled.
  - Our team wants to keep track about the amount of time spent on each project.

### Tasks

The Task feature can be used to manage tasks in the same calendar-plan view as habits. The calendar-plan view can be used
to manage tasks by priority. New tasks are commonly added as `unsceduled` and can be moved up until it is planned
today or within the next few days. A task supports the following options:

- **Title**: The content title.
- **Description**: A detailed description of the task.
- **Interval**: The interval the task is planned reflecting its priority e.g. within next few days, within this week (see below).
- **Score**: Choose a score, which reflects the cost of a task.
- **User Strategy**: A task can be configured as `per-user` or `shared` for personal or collaborative task management.

As mentioned, tasks are managed within a calendar-plan view, which separates tasks in one of the following intervals (suggestion):

- `Daily`: A task which should be completed within the next 1-2 days.
- `Weekly`:  A taks which should ideally be completed within this week.
- `Monthly`:  A Habit which I should be done once or multiple times a month.
- `Quarterly`:  A Habit which I should be done once or multiple times a quarter.
- `Yearly`:  A Habit which I should be done once or multiple times a year.
- `Unscheduled`: A Habit which is not scheduled.

:::note
The actual strategy of choosing an interval for your tasks is up to you and your team.
:::

### Journals

While Tasks and Habits are used for tracking activities and todos within a profile, the Journals feature is meant to 
track any kind of recurring data for reporting purposes in a calendar-plan view and supports additional input types:

- **Numbers**: Similar to habits
- **Text**: Textarea input
- **Time**: A timer with play/pause button as well as manual input.
- **Multi Select** A checkbox list selection of predefined values.
- **Radio Select** A radio input selection of predefined values.
- **Dropdown Select** A dropdown selection of predefined values.

### Milestones

The “Milestones” feature can be used to track and discuss the progression of different types of content by summarizing 
them in a milestone. Similar to the previous described features, the Milestone feature offers a calendar-plan
view for sorting and scheduling milestones by priority.

### Analytics

The Analytics feature is a powerful tool for evaluating data such as habit and journal data as well as profile scores by
creating customized charts. This feature allows you to add and combine multiple chart series to
analyze the correlations between your profile data. The following chart series are available by default:

- **Profile Score**: Visualizes the progression of the profile score over time, allowing you to track and analyze 
trends in performance or changes in score throughout a specified period optionally filtered by tags.
- **User Score**: Visualizes scores grouped by users. You can choose specific users and/or include the currently active 
user. Optionally you can filter for scores related to certain tags.

### Legal

The Legal module is used to manage legal links and translatable texts, as privacy notes terms of service which are 
embedded in certain parts of your platform to comply with regulatory requirements and ensure legal compliance. At the
moment the links and texts are managed by configuration file.