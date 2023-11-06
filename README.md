# Lyvely

Lyvely is a versatile self-management and collaboration platform designed for both individual and team usage. 
It serves as a ready-to-use solution and furthermore offers a powerful framework for building customized collaboration
platforms. With Lyvely, you can harness an extensive set of APIs and modular system to create specialized collaboration environments
that suit your unique needs.

> Lyvely is an actively developed project, and its features and APIs are subject to ongoing improvements and refinements. 
> We welcome contributions from the community to help shape the future of Lyvely and make it even more valuable to users.

## Key Features

The following core features form the basis for building flexible and expandable communication platforms with Lyvely:

- **Content**: Easily implement new types of content to meet your specific requirements.
- **Profiles**: Support for multiple profiles per user, including private, group, and organizational profiles.
- **Features**: Define configurable feature switches to customize your collaboration environment.
- **Permission Management**: Elaborate control over who can access and modify content and features within profiles.
- **Policies**: Create reusable and replaceable rules within your network for consistent governance.
- **Live Updates**: Keep your UI synchronized with real-time updates.
- **Content Stream**: Engage in discussions, take notes, and brainstorm with ease.
- **Tags**: Categorize and filter content for efficient organization.
- **Notifications**: Stay informed about network activities through various channels, such as email and push notifications.

## Optional Features at a glance

In addition to the core features, Lyvely offers some optional feature modules out of the box:

 - **Activity planner**: Efficiently manage daily, weekly, monthly, quarterly, yearly, or non-scheduled recurring 
activities and tasks. Whether it's personal habits or team and organization-related activities, Lyvely has you covered.
 - **Milestones**: Assign content as tasks and activities to milestones for better project management.
 - **Journal**: Keep track of and evaluate any data over time to make informed decisions.

## Architecture at a Glance

Lyvely is designed as Single Page Application (SPA) and Progressive Web App (PWA) 
with a robust technology stack that ensures flexibility, performance, and scalability. Here's an overview of the key technologies and frameworks that power
Lyvely:

 - **TypeScript**: The use of TypeScript in both the frontend and backend enables code sharing and typesafe interfaces. 
It combines the flexibility of JavaScript with the benefits of static typing, contributing to a more robust and maintainable
codebase.
 - **Vue.js**: The frontend is built on Vue.js, one of the leading JavaScript frameworks. Vue.js provides a flexible and
modern web frontend, enabling a responsive and interactive user interface that adapts seamlessly to various devices.
 - **Tailwind CSS**: Lyvely's user interface is crafted with Tailwind CSS, a utility-first CSS framework. Combined with 
a custom component library, Tailwind CSS delivers a unique and visually appealing user experience while maintaining maintainability and consistency in styling.
 - **NestJS**: The backend of Lyvely is driven by NestJS, a robust framework for building scalable and maintainable 
server-side applications. NestJS offers tools for implementing a clean and modular architecture, ensuring 
code organization and extensibility.
 - **MongoDB**:  Lyvely leverages MongoDB as its data store. This choice enables a flexible approach
for building scalable, content-centric applications.
 - **Redis**: Redis serves as a multipurpose key-value store, providing reliability for caching, queuing and messaging within Lyvely.

## Additional Libraries

Lyvely extends its functionality through a set of additional libraries, commonly employed for core and feature development. 
These libraries enhance various aspects of the application:

- **@lyvely/calendar-plan** This library is essential for feature modules like activities and journals. It offers 
interfaces and components to create customized calendar plan features. With @lyvely/calendar-plan, you can efficiently 
manage and visualize schedules and events within your collaboration environment.
- **@lyvely/time-series** The time series module is a versatile tool for tracking and analyzing data over time. It plays
a vital role in the journals and activities feature, enabling you to monitor trends, patterns, and historical data within Lyvely.
- **@lyvely/ui** The UI component library provides a collection of core user interface components. 
These components are extensively utilized in both the core application and various feature modules. @lyvely/ui ensures
consistency in design and user experience across Lyvely's interface.
- **@lyvely/common** The common library serves as a repository for frequently used features shared between the frontend
and backend.
- **@lyvely/dates** The dates library simplifies date and time-related operations, offering a range of useful features
for managing time-sensitive data. It enhances Lyvely's capability to work with timestamps, schedules, and event-related
functionalities.

## Getting Started

To get started with Lyvely, follow the installation instructions in our [documentation](https://docs.lyvely.app).

## Roadmap

Lyvely has an exciting roadmap ahead, with several features planned for the near future.
These features will further enhance the platform's functionality and user experience:

- **Statistics** Gain valuable insights by analyzing data provided by journals and activities.
  This feature will empower users to make data-driven decisions and track trends within their
  collaboration environment.
- **Reminder** Introducing a flexible and recurrent reminder API. With this feature,
  users will be able to set reminders for important tasks, activities, or events, ensuring they
  never miss a deadline or important event again. The reminder system will be designed to adapt
  to various scheduling needs and preferences.

## Contributing

We welcome contributions from the community! If you'd like to contribute to Lyvely, please review our 
[contribution guidelines]().

## License

Lyvely is released under the AGPLv3 Lincense.

## Contact Us

If you have any questions, suggestions, or need assistance, feel free to contact us.