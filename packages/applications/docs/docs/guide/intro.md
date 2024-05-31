---
---

# User Guide

Welcome to the Lyvely user guide! In this guide we will explore different features and discover common use-cases of
the platform.

Lyvely is a versatile self-management and collaboration platform suitable for both individual and team usage and aims for
improving your ability to reach your goals and a healthy work-life balance.

While the guidelines provided are helpful, remember that they're not mandatory. Lyvely is designed with 
flexibility in mind, allowing you to adapt it to your preferences. Enjoy the freedom to use the platform in a way that 
suits you best. Let's start with a short overview of the main features of the platform.

## Profiles

Lyvely allows you to manage multiple profiles for any aspect of your live, be it for private or professional application.
There are three types of profiles:


- `User`: These profiles consist of a single member. A private user profile is automatically created once you
join the platform. Only the owner of the profile can create and manage content and other features within the profile. 
You can also create user profiles visible to others.
- `Group`: A group profile can be used to communicate and collaboratively use the available features with your
friends, family or colleagues. Create group profiles for projects, departments, teams or any other form of user space.
- `Organization`: Organization profiles can contain sub profiles of any kind and have a special set of content visibility
rules and permissions.

## Users & Permissions

As mentioned in the last section, some profiles support multiple members which can be managed by the profile owner
or administrators. Each member is assigned with a specific **role** within the profile as well as optional **groups**. Both,
the role and groups are used to manage the **permissions** within a profile. Some permissions can also be granted to non-member
users. There are the following user roles available:

- `Owners`: A owner of the profile, has special permissions as archiving the profile.
- `Admins`: Administrators are usually granted with most permissions within a profile.
- `Moderators`: Moderators roles can be assigned with extended permissions for managing users and content.
- `Members`: Normal members of the profile usually can create content and access most sections of a profile.
- `Guests`: A profile guest is a special kind of member, which may is granted with fewer permissions as normal members.
- `Organization`: A members of the same organization as a profile (but not the profile itself) may have more access as other users of the platform.
- `Follower`: Non-member users following a profile.
- `User`: Any other authenticated users without any relation to the profile.
- `Visitor`: If your Lyvely platform allows access for unauthenticated users access, profiles can manage access permissions for visitors.

Permissions granted for a role are automatically granted for higher roles. This means if we grant a certain permission to
the `members` role this permission will be granted for `members`, `moderators`, `admins`, `owners`.

More fine granular permission management can be configured by facilitating custom user groups within a profile.

:::note
The `guest` and `follower` feature is not yet implemented.
:::

## Profile Visibility

The visibility setting of a profile manages who can find and access a profile. It is possible to set the visibility level
of a profile to the following roles:

- `Member`: Members (including guest members) will always be able to see and access a profile.
- `Organization`: You may only want other organization members to see your profile.
- `Followers`: If the visibility level is set to follower, your profile can be searched, but is only accessible by followers.
- `User`: The profile is visible for any authenticated user.
- `Visitor`: The profile is also visible for non-authenticated users (if this is allowed by the platform).

:::note
The `follower` feature is not yet implemented.
:::

## Features

Within your profiles, you can enable, disable and configure a set of features to fit your use-case. The available set
of features depends on the installed modules of the platform and its policies. Some platforms may only allow certain
features for certain profiles. A module may offer multiple features for fine-granular customization of a profile.

Here you have a list of the main features available on profile level:

### Stream

The stream can be used to communicate with your members or for brainstorming and information management in single user
profiles. The stream will contain any kind content in a chat-like view. Each content entry supports a multi-level sub 
discussion stream. This means you can not only create comments to content entries, but add any kind of content to
the discussion and therefore use this to further structure your discussions.

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

### Analytics

The Analytics feature is a powerful tool used to evaluate and compare data as habit and journal data as well as profile 
scores by creating custom charts. By default, the following chart series are available:

- **Profile Score**: Visualizes the progression of the profile score over time, allowing you to track and analyze 
trends in performance or changes in score throughout a specified period optionally filtered by tags.
- **User Score**: Visualizes scores grouped by users. You can choose specific users and/or include the currently active 
user. Optionally you can filter for scores related to certain tags.