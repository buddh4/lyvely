import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import userRoutes from "@/modules/user/routes";
import activityRoutes from "@/modules/activity/routes";
import journalRoutes from "@/modules/journal/routes";
import statisticRoutes from "@/modules/statistics/routes";
import NotFound from "@/modules/ui/components/error/NotFound.vue";
import uiRoutes from "@/modules/ui/routes";
import { useAuthStore } from '@/modules/user/store/auth.store';
import { useProfileStore } from '@/modules/user/store/profile.store';

const routes: Array<RouteRecordRaw> = [];

function register(registerRoutes: Array<RouteRecordRaw>) {
  registerRoutes.forEach(route => routes.push(route));
}

// TODO: Make configurable
register([{ path: "/", redirect: "/activities/habits" }]);
register(userRoutes);
register(activityRoutes);
register(journalRoutes);
register(statisticRoutes);
register(uiRoutes);

register([{ path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound }]);

const history = createWebHistory();

const router = createRouter({ routes, history });

// TODO: dynamic behavior...
const publicRoutes = ['/login', '/register'];

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
