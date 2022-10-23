import { createRouter, createWebHistory, RouteRecordRaw, RouteLocation, NavigationGuardNext } from 'vue-router';

import NotFound from '@/modules/ui/components/error/NotFound.vue';
import { messageLoaderGuard } from '@/modules/i18n';
import { authGuard } from '@/modules/auth';
import NProgress from 'nprogress';
import moduleRouteLoader from './module-route-loader.util';
import { appConfigGuard } from '@/modules/app-config';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';
import { usePageStore } from '@/modules/core/store/page.store';
import { loadProfile } from '@/modules/profiles';

const routes: Array<RouteRecordRaw> = [];

function register(registerRoutes: Array<RouteRecordRaw>) {
  registerRoutes.forEach((route) => routes.push(route));
}

function registerRoutes() {
  // TODO: Make home configurable per profile
  register([{ path: '/', redirect: profileRoute() }]);
  moduleRouteLoader(register);
  register([{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }]);
}

registerRoutes();

const router = createRouter({ routes, history: createWebHistory() });
router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start();
  }
  next();
});
router.beforeEach(appConfigGuard);
router.beforeEach(messageLoaderGuard);
router.beforeEach(authGuard);
router.afterEach(() => usePageStore().setShowAppLoader(false));
router.beforeEach((to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  if (to.meta?.layout === 'profile') {
    return loadProfile(to, from, next);
  }
  next();
});
router.afterEach((to: RouteLocation) => {
  if (to.meta?.title) usePageStore().setTitle(to.meta?.title());
});
router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done();
});
export default router;
