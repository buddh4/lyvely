import "reflect-metadata";

import { createApp, markRaw } from "vue";
import App from "./App.vue";
import router from "./router";
import defineLocales from "./util/locales";

import "./index.css";
import "animate.css/animate.css";

import { setupI18n } from "./i18n";
import { createPinia } from 'pinia';
import { eventBus } from '@server/modules/core/events/global.emitter';
import { focus } from "@server/directives/focus";
import { UiPlugin } from "@server/modules/ui/ui.plugin";
import { ModuleLoader } from "@server/module.loader";

console.log("Starting...");

defineLocales();

console.log("Initializing app...");

eventBus.emit('app.create.pre');

const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(ModuleLoader);
app.use(setupI18n());
app.use(UiPlugin);

eventBus.emit('app.create.post', app);

app.directive('focus', focus);

eventBus.emit('app.mount.pre', app);

app.mount("#app");

eventBus.emit('app.mount.post', app);

if (window.Cypress) {
  // only available during E2E tests
  window.app = app;
}

console.log("App initialized");
