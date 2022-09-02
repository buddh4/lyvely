import "reflect-metadata";

import { createApp, markRaw } from "vue";
import App from "./App.vue";
import router from "./router";
import defineLocales from "./util/locales";

import "./index.css";
import "animate.css/animate.css";

import { setupI18n } from "./i18n";
import { createPinia } from 'pinia';
import { eventBus } from '@/modules/core/events/global.emitter';
import { focus } from "@/directives/focus";
import { UiPlugin } from "@/modules/ui/ui.plugin";

console.log("Starting...");

defineLocales();

console.log("Initializing app...");

eventBus.emit('app.create.pre');

const app = createApp(App);

app.use(UiPlugin);

eventBus.emit('app.create.post', app);

const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = markRaw(router);
})

app.use(pinia);
app.use(router);
app.use(setupI18n());

app.directive('focus', focus);

eventBus.emit('app.mount.pre', app);

app.mount("#app");

eventBus.emit('app.mount.post', app);



if (window.Cypress) {
  // only available during E2E tests
  window.app = app;
}

console.log("App initialized");
