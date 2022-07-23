import "reflect-metadata";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import defineLocales from "./util/locales";

import "./index.css";
import "animate.css/animate.css";

import { setupI18n } from "./i18n";
import { createPinia } from 'pinia';
import { eventBus } from '@/modules/core/events/global.emitter';

console.log("Starting...");

defineLocales();

console.log("Initializing app...");

eventBus.emit('app.create.pre');

const app = createApp(App);

eventBus.emit('app.create.post', app);

app.use(createPinia());
app.use(router);
app.use(setupI18n());

eventBus.emit('app.mount.pre', app);

app.mount("#app");

eventBus.emit('app.mount.post', app);



if (window.Cypress) {
  // only available during E2E tests
  window.app = app;
}

console.log("App initialized");
