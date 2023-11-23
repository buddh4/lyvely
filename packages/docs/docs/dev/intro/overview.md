---
---

# Overview 

Welcome to the Lyvely Development Guide! This comprehensive guide is your gateway to mastering the inner workings of 
Lyvely, enabling you to implement custom features and extend the core functionality of our framework. Lyvely provides 
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
- **Profiles**: Support for multiple profiles per user, including private, group, and organizational profiles.
- **Features**: Define configurable feature switches to customize your collaboration environment.
- **Permission Management**: Elaborate control over who can access and modify content and features within profiles.
- **Policies**: Create reusable and replaceable rules within your network for consistent governance.
- **Live Updates**: Keep your UI synchronized with real-time updates over server-sent events (SSE).
- **Content Stream**: Engage in discussions, take notes, and brainstorm with ease.
- **Tags**: Categorize and filter content for efficient organization.
- **Notifications**: Stay informed about network activities through various channels, such as email and push notifications.

## Optional Features

In addition to the core features, Lyvely offers some optional feature modules out of the box:

- **Activity planner**: Efficiently manage daily, weekly, monthly, quarterly, yearly, or non-scheduled recurring
  activities and tasks. Whether it's personal habits or team and organization-related activities, Lyvely has you covered.
- **Milestones**: Assign content as tasks and activities to milestones for better project management.
- **Journal**: Keep track of and evaluate any data over time to make informed decisions.

## Architecture at a Glance

Lyvely is designed as **Single Page Application (SPA)** and **Progressive Web App (PWA)**
with a robust technology stack that ensures flexibility, performance, and scalability. Here's an overview of the key 
technologies and frameworks that power Lyvely:

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

- **@lyvely/common** The common library serves as a repository for frequently used features shared between the frontend
  and backend.
- **@lyvely/ui** The UI component library provides a collection of core user interface components.
  These components are extensively utilized in both the core application and various feature modules. @lyvely/ui ensures
  consistency in design and user experience across Lyvely's interface.
- **@lyvely/dates** The dates library simplifies date and time-related operations, offering a range of useful features
  for managing time-sensitive data. It enhances Lyvely's capability to work with timestamps, schedules, and event-related
  functionalities.
- **@lyvely/calendar-plan** This library is essential for feature modules like activities and journals. It offers
  interfaces and components to create customized calendar plan features. With @lyvely/calendar-plan, you can efficiently
  manage and visualize schedules and events within your collaboration environment.
- **@lyvely/time-series** The time series module is a versatile tool for tracking and analyzing data over time. It plays
  a vital role in the journals and activities feature, enabling you to monitor trends, patterns, and historical data within Lyvely.


