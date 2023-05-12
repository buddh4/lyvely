import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouteLocation,
  NavigationGuardNext,
} from 'vue-router';

import NotFound from '@/modules/ui/components/error/NotFound.vue';
import { messageLoaderGuard } from '@/modules/i18n';
import { authGuard } from '@/modules/auth';
import NProgress from 'nprogress';
import moduleRouteLoader from './module-route-loader.util';
import { appConfigGuard } from '@/modules/app-config';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';
import { usePageStore } from '@/modules/core/store/page.store';
import { loadProfile } from '@/modules/profiles';
import { useHelpStore } from '@/modules/help/stores/help.store';
import { showMobileNavGuard } from '@/modules/core';
import { animateContentStreamFooterGuard } from '@/modules/content-stream/guards';

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
router.beforeEach((to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  const doc = window.document;
  const standalone = (<any>window.navigator).standalone;

  // If there's a hash, or addEventListener is undefined, stop here
  if (!standalone && !location.hash && window.addEventListener) {
    //scroll to 1
    window.scrollTo(0, 1);
    let scrollTop = 1;
    const getScrollTop = () => {
      return (
        window.pageYOffset ||
        (doc.compatMode === 'CSS1Compat' && doc.documentElement.scrollTop) ||
        doc.body.scrollTop ||
        0
      );
    };
    //reset to 0 on bodyready, if needed
    const bodycheck = setInterval(function () {
      if (doc.body) {
        clearInterval(bodycheck);
        scrollTop = getScrollTop();
        window.scrollTo(0, scrollTop === 1 ? 0 : 1);
      }
    }, 15);

    window.addEventListener(
      'load',
      function () {
        setTimeout(function () {
          //at load, if user hasn't scrolled more than 20 or so...
          if (getScrollTop() < 20) {
            //reset to hide addr bar at onload
            window.scrollTo(0, scrollTop === 1 ? 0 : 1);
          }
        }, 0);
      },
      false,
    );
  }
  next();
});
router.beforeEach(messageLoaderGuard);
router.beforeEach(appConfigGuard);
router.beforeEach(authGuard);
router.afterEach(() => usePageStore().setShowAppLoader(false));
router.beforeEach(showMobileNavGuard);
router.beforeEach((to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  if (to.query.help === '1') {
    useHelpStore().setShowModal(true);
  }

  if (to.meta?.layout?.startsWith('profile')) {
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
