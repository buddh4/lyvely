---
---

# Overview 

Welcome to the Lyvely Development Guide! This comprehensive guide is your gateway to mastering the inner workings of 
Lyvely, enabling you to implement custom features and extend the core functionality of the platform. Lyvely provides 
a powerful set of APIs, which we will delve into in-depth throughout this guide.


:::warning

 **Project Under Active Development**
 Lyvely is currently in active development, and as such, the documentation and APIs provided are subject to change. 
 While we strive to maintain consistency and usability, please be aware that updates and improvements are ongoing.
 As a user or contributor, your feedback and input are highly valuable in shaping the project's direction. 
 We appreciate your understanding as we work to enhance and stabilize the platform.
 Before deploying Lyvely in a production environment or making critical dependencies on its APIs, we recommend 
 monitoring the project's updates and referring to the latest documentation for the most accurate and up-to-date information.
 Thank you for your interest and support in making Lyvely a robust and reliable solution for content-centric 
 communication and collaboration.

:::

## Key Features

The following core features form the basis for building flexible and expandable communication platforms with Lyvely:

- **Content**: Implement new types of content to meet your specific requirements.
- **Profiles**: Support for multiple profiles per user, including private, public, user, group, and organizational profiles.
- **Score**: Profile scores help you to measure progression of a profile and its members.
- **Features**: Define configurable feature switches to customize your collaboration environment.
- **Permission Management**: Elaborate control over who can access and modify content and features within profiles.
- **Policies**: Create reusable and configurable rules within your platform for consistent governance.
- **Live Updates**: Keep your UI synchronized with real-time updates over server-sent events (SSE).
- **Content Stream**: Engage in discussions, take notes, and brainstorm with ease.
- **Tags**: Categorize and filter content for efficient organization.
- **Notifications**: Stay informed about network activities through various channels, such as email and push notifications.

## Optional Features

In addition to the core features, Lyvely offers some optional feature modules out of the box:

- [Tasks](https://github.com/buddh4/lyvely/tree/main/packages/features/tasks): 
A Task manager with calendar-plan view, for per-user or shared task management.
- [Habits](https://github.com/buddh4/lyvely/tree/main/packages/features/habits): 
A Habit manager with calendar-plan view, for per-user or shared habit management.
- [Milestones](https://github.com/buddh4/lyvely/tree/main/packages/features/milestones): 
Assign content as tasks and activities to milestones for better project management.
- [Activities](https://github.com/buddh4/lyvely/tree/main/packages/features/activities/web): 
This frontend module optionally connects Task, Habits and Milestones into a single menu entry.
- [Journals](https://github.com/buddh4/lyvely/tree/main/packages/features/journals): 
Keep track of and evaluate any data over time to make informed decisions.
- [Analytics](https://github.com/buddh4/lyvely/tree/main/packages/features/analytics):
Analyze and correlate data from other modules.

## Architecture at a Glance

Lyvely is designed as **Single Page Application (SPA)** and **Progressive Web App (PWA)**
with a robust technology stack that ensures flexibility, performance, and scalability. Here's an overview of the key 
technologies and frameworks that power Lyvely:

- [TypeScript](https://www.typescriptlang.org): The use of TypeScript in both the frontend and backend enables code sharing and typesafe interfaces.
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

## Build & Testing

The Lyvely core project makes use of the following build and test related libraries:

- [rushjs](https://rushjs.io/): A scalable monorepo manager.
- [pnpm](https://pnpm.io/): Package manager (mainly wrapped by rushjs).
- [cypress](https://www.cypress.io/): Used for Integration testing.
- [vitest](https://vitest.dev/): Used for frontend unit testing.
- [jest](https://jestjs.io/): Used for unit testing.
- [vite](https://vitejs.dev/): Used build tool for frontend packages.
- [rollup](https://rollupjs.org/): Used as package bundler for web and interface packages.

## Additional Libraries

Lyvely extends its functionality through a set of additional libraries, commonly employed for core and feature development.
These libraries enhance various aspects of the application:

- [@lyvely/common](https://github.com/buddh4/lyvely/tree/main/packages/libs/common):
The common library serves as a repository for frequently used features and helpers shared between the frontend and backend.
- [@lyvely/ui](https://github.com/buddh4/lyvely/tree/main/packages/libs/ui):
The UI component library provides a collection of core user interface components. These components are extensively 
utilized in both the core application and various feature modules. *@lyvely/ui* ensures consistency in design and user 
experience across Lyvely's user interface.
- [@lyvely/dates](https://github.com/buddh4/lyvely/tree/main/packages/libs/dates):
The dates library simplifies date and time-related operations, offering a range of useful features
for managing time-sensitive data. It enhances Lyvely's capability to work with timestamps, schedules, and event-related
functionalities by wrapping the powerful [day.js](https://day.js.org/) library.
- [@lyvely/calendar-plan](https://github.com/buddh4/lyvely/tree/main/packages/libs/calendar-plan):
This library is essential for feature modules like tasks, habits and journals. It offers
interfaces and components to create customized calendar-plan features. With *@lyvely/calendar-plan*, you can efficiently
manage and visualize schedules and events within your collaboration environment.
- [@lyvely/time-series](https://github.com/buddh4/lyvely/tree/main/packages/libs/time-series):
The time series module is a versatile tool for tracking and analyzing data over time. It plays
a vital role in the journals and activities feature, enabling you to monitor trends, patterns, and historical data within Lyvely.


