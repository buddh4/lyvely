&nbsp;
<p align="center">
  <a href="https://lyvely.app/#gh-light-mode-only" target="_blank">
    <img src="https://github.com/buddh4/lyvely/blob/main/design/lyvely-readme-logo-light.png?raw=true" alt="Lyvely" width="210px">
  </a>
  <a href="https://lyvely.app/#gh-dark-mode-only" target="_blank">
    <img src="https://github.com/buddh4/lyvely/blob/main/design/lyvely-readme-logo-dark.png?raw=true" alt="Lyvely" width="210px">
  </a>
</p>
&nbsp;


<p align="center">
    <a href="https://lyvely.app/">App</a> •
    <a href="https://forum.ghost.org">Docs</a> •
    <a href="https://github.com/TryGhost/Ghost/blob/main/.github/CONTRIBUTING.md">Contributing</a> •
    <a href="https://twitter.com/ghost">Twitter</a>
</p>

Lyvely is a flexible self-management and collaboration platform designed for both individual and team usage. 
It serves as a ready-to-use solution and furthermore offers a powerful framework for building customized collaboration
platforms.

> Lyvely is an actively developed project, and its features and APIs are subject to ongoing improvements and refinements. 
> We welcome contributions from the community to help shape the future of Lyvely and make it even more valuable to users.

## Getting Started

To get started with Lyvely, follow the installation instructions in our [documentation](https://docs.lyvely.app).

## Core Features

The following selection of features are part of the Lyvely core.

 - **Profiles**: Private-, Group- and Organization profiles serve as home for your content and users.
 - **Main Stream**: A chat-like view containing all sorts of content within a profile.
 - **Content Stream**: Each content entry itself can be discussed within an own chat-like Content Stream.
 - **Messages**: The most simple form of content with markdown support.
 - **Tags**: Mark and filter your content with the help of tags.

## Feature Modules

The following optional modules are maintained within this repository.

 - [Habits](https://github.com/buddh4/lyvely/tree/main/packages/features/habits): Efficiently manage daily, weekly, monthly, quarterly, yearly, or non-scheduled activities.
Whether it's personal habits or team and organization-related activities, Lyvely has you covered. A habit can be defined as shared or per-user.
- [Tasks](https://github.com/buddh4/lyvely/tree/main/packages/features/tasks): Organize individual or team tasks using a Calendar Planner.
A task can be defined as shared or per-user.
- [Milestones](https://github.com/buddh4/lyvely/tree/main/packages/features/milestones): Assign and keep track of your content by assigning it to a milestone.
- [Journals](https://github.com/buddh4/lyvely/tree/main/packages/features/journals): Keep track of and evaluate any data over time to make informed decisions.
  A journal can be defined as shared or per-user.
- [Analytics](https://github.com/buddh4/lyvely/tree/main/packages/features/analytics): Visualize and compare your data using customizable time series and various chart types.
- [Legal](https://github.com/buddh4/lyvely/tree/main/packages/features/analytics): Define translatable your communities Privacy Notes and Terms of Service or other legal texts.

## Core APIs

The following core APIs form the basis for building flexible and expandable communication platforms with Lyvely:

- **Profiles**: Support for multiple profiles per user, including private, group, and organizational profiles.
- **Content**: Implement new types of content to meet your specific requirements.
- **Features**: Define configurable feature switches to customize your collaboration environment.
- **Permission Management**: Elaborate control over who can access and modify content and features within profiles.
- **Policies**: Create reusable and replaceable rules within your network for consistent governance.
- **Live Updates**: Keep your UI synchronized with real-time updates.
- **Content Stream**: Engage in discussions, take notes, and brainstorm with ease.
- **Tags**: Categorize and filter content for efficient organization.
- **Notifications**: Stay informed about network activities through various channels, such as email and push notifications.

## Libraries

Lyvely extends its functionality through a set of additional libraries, commonly employed for core and feature development.
These libraries enhance various aspects of the application:

- [@lyvely/ui](https://github.com/buddh4/lyvely/tree/main/packages/libs/ui) The UI component library provides a collection of core user interface components.
  These components are extensively utilized in both the core application and various feature modules. @lyvely/ui ensures
  consistency in design and user experience across Lyvely's interface.
- [@lyvely/time-series](https://github.com/buddh4/lyvely/tree/main/packages/libs/time-series) The time series module is a versatile tool for tracking and analyzing data over time. It plays
  a vital role in the journals and activities feature, enabling you to monitor trends, patterns, and historical data within Lyvely.
- [@lyvely/calendar-plan](https://github.com/buddh4/lyvely/tree/main/packages/libs/calendar-plan) This library is essential for feature modules like activities and journals. It offers
  interfaces and components to create customized calendar plan features. With @lyvely/calendar-plan, you can efficiently
  manage and visualize schedules and events within your collaboration environment.
- [@lyvely/common](https://github.com/buddh4/lyvely/tree/main/packages/libs/common) The common library serves as a repository for frequently used features shared between the frontend
  and backend.
- [@lyvely/dates](https://github.com/buddh4/lyvely/tree/main/packages/libs/dates) The dates library simplifies date and time-related operations, offering a range of useful features
  for managing time-sensitive data. It enhances Lyvely's capability to work with dates.
- [@lyvely/devtools](https://github.com/buddh4/lyvely/tree/main/packages/libs/devtools) Provides shared configurations and build tools.

## Powered By

Lyvely is designed as Single Page Application (SPA) and Progressive Web App (PWA) 
with a robust technology stack that ensures flexibility, performance, and scalability. Here's an overview of the key technologies and frameworks that power
Lyvely:

 - [TypeScript](https://www.typescriptlang.org/): The use of TypeScript in both the frontend and backend enables code sharing and typesafe interfaces. 
It combines the flexibility of JavaScript with the benefits of static typing, contributing to a more robust and maintainable
codebase.
 - [Vue.js](https://vuejs.org/): The frontend is built on Vue.js, one of the leading JavaScript frameworks. Vue.js provides a flexible and
modern web frontend, enabling a responsive and interactive user interface that adapts seamlessly to various devices.
 - [Tailwind CSS](https://tailwindcss.com/): Lyvely's user interface is crafted with Tailwind CSS, a utility-first CSS framework. Combined with 
a custom component library, Tailwind CSS delivers a unique and visually appealing user experience while maintaining maintainability and consistency in styling.
 - [NestJS](https://nestjs.com/): The backend of Lyvely is driven by NestJS, a robust framework for building scalable and maintainable 
server-side applications. NestJS offers tools for implementing a clean and modular architecture, ensuring 
code organization and extensibility.
 - [MongoDB](https://www.mongodb.com/):  Lyvely leverages MongoDB as its data store. This choice enables a flexible approach
for building scalable, content-centric applications.
 - [Redis](https://redis.io/): Redis serves as a multipurpose key-value store, providing reliability for caching, queuing and messaging within Lyvely.

## Contributing

We welcome contributions from the community! If you'd like to contribute to Lyvely, please review our 
[contribution guidelines]().

## License

Lyvely is released under the AGPLv3 Lincense.

## Contact Us

If you have any questions, suggestions, or need assistance, feel free to contact us.