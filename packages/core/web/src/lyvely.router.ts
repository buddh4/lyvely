import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouteLocation,
  NavigationGuardNext,
  NavigationGuardWithThis,
  NavigationGuard,
  RouteLocationNormalized,
  LocationQueryRaw,
  RouteLocationRaw,
} from 'vue-router';

//import { messageLoaderGuard } from '@/i18n';
//import { authGuard } from '@/auth';
import NProgress from 'nprogress';
//import { appConfigGuard } from '@/app-config';
//import { profileRoute } from '@/profiles/routes/profile-route.util';
import { usePageStore, closeMobileDrawerGuard, showMobileNavGuard } from '@/core';
//import { loadProfile } from '@/profiles';
//import { useHelpStore } from '@/help/stores/help.store';
import { messageLoaderGuard } from '@/i18n';
//import { useAppConfigStore } from '@/core-app/dist/src/modules/app-config/store/app-config.store';
//import { eventBus } from '../events';
import NotFound from '@/ui/components/errors/NotFound.vue';

const guards: NavigationGuard[] = [];
const afterEffectGuards: NavigationGuard[] = [];

export const router = createRouter({
  routes: [{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }],
  history: createWebHistory(),
});

export function registerRoutes(registerRoutes: Array<RouteRecordRaw>) {
  registerRoutes.forEach((route) => router.addRoute(route));
}

export type GuardRegistration = Array<
  NavigationGuard | { on: 'afterEffects' | 'beforeView'; guards: Array<NavigationGuard> }
>;

export function registerGuards(navGuards: GuardRegistration) {
  navGuards.forEach((guard) => {
    if (typeof guard === 'function') guards.push(guard);
    else if (guard.on === 'beforeView') guards.push(...guard.guards);
    else afterEffectGuards.push(...guard.guards);
  });
}

function moduleGuards(guards: Array<NavigationGuard>) {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    // Create a recursive function to apply guards sequentially
    function applyGuard(index: number) {
      if (index < guards.length) {
        const guard = guards[index];
        console.debug('Run module guard: ' + guard.name);
        guard(to, from, (n?: any) => {
          if (n) next(n);
          else applyGuard(index + 1);
        });
      } else {
        // All guards have been applied, call the next() function
        next();
      }
    }

    // Start applying guards from index 0
    applyGuard(0);
  };
}

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

router.beforeEach(moduleGuards(guards));

router.beforeEach(showMobileNavGuard);
router.beforeEach(closeMobileDrawerGuard);
/*router.beforeEach((to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  if (to.query.help === '1') {
    useHelpStore().setShowModal(true);
  }

  if (to.meta?.layout?.startsWith('profile')) {
    return loadProfile(to, from, next);
  }

  next();
});*/

router.afterEach(() => usePageStore().setShowAppLoader(false));
router.afterEach((to: RouteLocation) => {
  if (to.meta?.title) usePageStore().setTitle(to.meta?.title());
});

router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done();
});

router.beforeEach(moduleGuards(afterEffectGuards));
