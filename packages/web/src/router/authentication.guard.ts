import { useAuthStore } from "@/modules/users/store/auth.store";
import { NavigationGuardWithThis } from "vue-router";

const publicRoutes = ["/", "/login", "/register"];

const util: NavigationGuardWithThis<undefined> = (to, from, next) => {
  const promises: Promise<any>[] = [];
  const authStore = useAuthStore();

  debugger;

  // TODO: GUEST - needs to be aligned for guest mode feature
  if (!authStore.isAuthenticated && !publicRoutes.includes(to.path)) {
    next("/login");
    return;
  }

  if (["/login", "/logout"].includes(to.path)) {
    next();
    return;
  }

  if (!publicRoutes.includes(to.path) && !authStore.user) {
    // Load user data if not in state, e.g. manual on page reload
    promises.push(authStore.loadUser());
  }

  Promise.all(promises)
    .then(() => next())
    .catch((err) => {
      console.error(err);
      if (err?.response?.status === 401) {
        authStore.logout();
      }
    });
};

export default util;
