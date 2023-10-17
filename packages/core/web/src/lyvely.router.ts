import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouteLocation,
  NavigationGuardNext,
  NavigationGuard,
  RouteLocationNormalized,
  NavigationHookAfter,
} from 'vue-router';

//import { useHelpStore } from '@/help/stores/help.store';

const beforeNavigate: NavigationGuard[] = [];
const guards: NavigationGuard[] = [];
const afterNavigate: NavigationGuard[] = [];
const navigationHooksAfter: NavigationHookAfter[] = [];

export const router = createRouter({
  routes: [],
  history: createWebHistory(),
});

export function registerRoutes(registerRoutes: Array<RouteRecordRaw>) {
  registerRoutes.forEach((route) => router.addRoute(route));
}

export type GuardRegistration = Array<
  | NavigationGuard
  | { on: 'beforeNavigate' | 'guard' | 'afterNavigate'; guards: Array<NavigationGuard> }
>;

export function registerGuards(navGuards: GuardRegistration) {
  navGuards.forEach((guard) => {
    if (typeof guard === 'function') guards.push(guard);
    else if (guard.on === 'guard') guards.push(...guard.guards);
    else if (guard.on === 'beforeNavigate') beforeNavigate.push(...guard.guards);
    else if (guard.on === 'afterNavigate') afterNavigate.push(...guard.guards);
  });
}

export function registerAfterNavigationHooks(hooks: NavigationHookAfter[]) {
  navigationHooksAfter.push(...hooks);
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

router.beforeEach(moduleGuards(beforeNavigate));

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

router.beforeEach(moduleGuards(guards));

router.beforeEach(moduleGuards(afterNavigate));
/*router.beforeEach((to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  if (to.query.help === '1') {
    useHelpStore().setShowModal(true);
  }

  if (to.meta?.layout?.startsWith('profile')) {
    return loadProfile(to, from, next);
  }

  next();
});*/

router.afterEach((to, from, failure) => {
  navigationHooksAfter.forEach((hook) => hook(to, from, failure));
});
