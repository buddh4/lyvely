import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import NotFound from "@/modules/ui/components/error/NotFound.vue";
import autoMessageLoaderGuard from './auto-message-loader.guard';
import authenticationGuard from './authentication.guard';
import moduleRouteLoader from './module-route-loader.util';
import appConfigLoader from './config.loader.guard';
import { profileRoute } from "@/modules/profile/routes/profile-route.util";


const routes: Array<RouteRecordRaw> = [];

function register(registerRoutes: Array<RouteRecordRaw>) {
  registerRoutes.forEach(route => routes.push(route));
}

function registerRoutes() {
  // TODO: Make home configurable per profile
  register([{ path: "/", redirect: profileRoute() }]);
  moduleRouteLoader(register);
  register([{ path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound }]);
}

registerRoutes();

const router = createRouter({ routes, history: createWebHistory() });
router.beforeEach(autoMessageLoaderGuard);
router.beforeEach(appConfigLoader);
router.beforeEach(authenticationGuard);
export default router;
