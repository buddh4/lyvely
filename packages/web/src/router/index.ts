import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import NotFound from "@/modules/ui/components/error/NotFound.vue";
import { useAuthStore } from '@/modules/user/store/auth.store';
import * as i18n from "@/i18n";
import { usePageStore } from "@/modules/core/store/page.store";
import { toRefs } from 'vue';


const routes: Array<RouteRecordRaw> = [];

function register(registerRoutes: Array<RouteRecordRaw>) {
  registerRoutes.forEach(route => routes.push(route));
}



// TODO: Make home configurable per profile
register([{ path: "/", redirect: "/activities/habits" }]);

const moduleRoutes = <{ default: Array<RouteRecordRaw> }[]> import.meta.glob('../modules/**/routes/index.ts', { eager: true });

for (const path in moduleRoutes) {
  const route = moduleRoutes[path];
  console.log(`Register module route ${path}`);
  if(route.default) {
    register(route.default);
  }
}

register([{ path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound }]);

const history = createWebHistory();

const router = createRouter({ routes, history });

// TODO: dynamic behavior...
const publicRoutes = ['/login', '/register'];

router.beforeEach(async (to, from, next) => {
  const { locale } = useAuthStore();
  const { showAppLoader } = toRefs(usePageStore());

  const promises: Promise<any>[] = [];

  if(!i18n.isGlobalMessagesLoaded(locale)) {
    showAppLoader.value = true;
    promises.push(i18n.setLocale(locale));
  }

  if(to.meta?.i18n?.module && !i18n.isModuleMessagesLoaded(locale, to.meta?.i18n?.module)) {
    showAppLoader.value = true;
    promises.push(i18n.loadModuleMessages(locale, to.meta?.i18n?.module));
  }

  if(promises.length) {
    await Promise.all(promises).catch(() => showAppLoader.value = false);
  }

  if(usePageStore().showAppLoader) {
    setTimeout(() => usePageStore().showAppLoader = false, 600);
  }

  next();
});

router.beforeEach((to, from, next) => {
  const promises: Promise<any>[] = [];
  const authStore = useAuthStore();

  // TODO: GUEST - needs to be aligned for guest mode feature
  if(!authStore.isAuthenticated && !publicRoutes.includes(to.path)) {
    next('/login');
    return;
  }

  if(['/login', '/logout'].includes(to.path)) {
    next();
    return;
  }

  if(!publicRoutes.includes(to.path) && !authStore.user) {
    // Load user data if not in state, e.g. manual on page reload
    promises.push(authStore.loadUser())
  }

  Promise.all(promises)
    .then(() => next())
    .catch(err => {
      console.error(err);
      if(err?.response?.status === 401) {
        next('/login');
      }
  });
})

export default router;
