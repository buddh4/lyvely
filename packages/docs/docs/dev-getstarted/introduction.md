---
sidebar_position: 1
---

# Introduction 

> **Disclaimer: Project Under Active Development**
> Lyvely is currently in active development, and as such, the documentation and APIs provided are subject to change. While we strive to maintain consistency and usability, please be aware that updates and improvements are ongoing.
> As a user or contributor, your feedback and input are highly valuable in shaping the project's direction. We appreciate your understanding as we work to enhance and stabilize the platform.
> Before deploying Lyvely in a production environment or making critical dependencies on its APIs, we recommend monitoring the project's updates and referring to the latest documentation for the most accurate and up-to-date information.
> Thank you for your interest and support in making Lyvely a robust and reliable solution for content-centric communication and collaboration.


Welcome to Lyvely, an open-source framework designed for crafting sophisticated, content-centric communication and 
collaboration platforms. Lyvely seamlessly integrates cutting-edge technologies to deliver a flexible and highly
extensible user experience. Lyvely is designed as a single-page application (SPA) that leverages TypeScript and [Vue3](https://vuejs.org/) 
on the frontend and [NestJs](https://nestjs.com/) on the backend. This architecture choice ensures flexibility, scalability, 
and maintainability as key pillars of the project.

## Key Features:

### Progressive Web Application (PWA)

The frontend of Lyvely is implemented as a Progressive Web Application (PWA). This approach enables users to install
Lyvely on their devices and facilitate modern web APIs as push notifications and service workers.
Users can enjoy a seamless and responsive experience on all sorts of devices. 

### Frontend Deployment Flexibility

Lyvely offers deployment flexibility by allowing the frontend to be served directly by the backend or deployed
separately. This flexibility caters to a wide range of deployment scenarios, making it easy to integrate Lyvely into
existing infrastructures or host it independently as needed. The frontend is composed of a static web project and
thus can be served by any web server or CDN.

### MongoDB as the Database

For efficient data storage and retrieval, Lyvely utilizes [MongoDB](https://www.mongodb.com/) as its database system. 
MongoDB's NoSQL nature provides flexibility in handling various types of data, making it a suitable choice for 
real-time web applications.

### Queue Management with BullMq and Redis

Lyvely employs [BullMq](https://docs.bullmq.io/) and [Redis](https://redis.io/) for managing queues efficiently. 
This combination ensures that background tasks, asynchronous processing, and job management are handled efficiently, 
contributing to the application's responsiveness and scalability.

### Realtime Updates via Server-Sent Events (SSE)

To provide users with real-time updates and notifications, Lyvely employs Server-Sent Events (SSE). 
This technology enables the frontend to receive data updates from the backend in real-time, enhancing the overall
user experience by keeping users informed and engaged.

### Frontend Powered by Tailwind 

As a frontend developer working with Lyvely, you'll find a developer-friendly environment that empowers you to
create modern user interfaces and deliver a fluid user experience. Here are some key aspects tailored to your needs:

#### Tailwind CSS Integration

Lyvely facilitates the use of [Tailwind CSS](https://tailwindcss.com/), a popular utility-first CSS framework. With Tailwind, you can easily craft
beautiful, responsive designs while maintaining a highly maintainable and efficient codebase. Leverage the extensive
utility classes provided by Tailwind to style your components effortlessly.

#### Custom Component Library:

Lyvely implements a custom component library designed to enhance consistency and reusability across the platform.
This library streamlines the development process by offering a set of pre-designed components that adhere to Lyvely's
design principles.

### Modular Extensibility

One of Lyvely's standout features is its extensibility. It allows developers to extend its functionality with
custom modules by providing sophisticated APIs and a module system as well as many configuration options.
Whether you want to integrate new features, enhance existing ones, or customize Lyvely to meet your specific 
requirements, the modular architecture makes it a breeze to do so.

### Monorepo Management with NX

The core application of Lyvely is structured as an [NPM monorepo](https://docs.npmjs.com/cli/v7/using-npm/workspaces) 
managed with [NX](https://nx.dev). This organization ensures efficient code sharing, scalability, and maintainability, 
making it easier for developers to work on various parts of the application cohesively.

### Conclusion

Lyvely's architecture combines the power of TypeScript, Vue3, NestJs, MongoDB, BullMq, Redis, and SSE to create a 
modern, responsive, and extensible web application. Whether you are a developer looking to contribute or a user seeking 
a flexible and engaging platform, Lyvely welcomes you to join the community and explore its exciting possibilities.

Feel free to dive into the codebase, participate in discussions, and help shape the future of Lyvely. Together, 
we can make web applications more dynamic, efficient, and enjoyable for everyone.

