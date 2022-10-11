import { ifNotAuthenticated } from "@/router/utils";
import { translate } from "@/i18n";
import { setPageTitle } from "@/modules/core/store/page.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export const PATH_LOGIN = "/login";
export const PATH_LOGOUT = "/logout";

export default [
  {
    path: PATH_LOGIN,
    name: "Login",
    component: () => import("../views/LoginView.vue"),
    beforeEnter: [
      ifNotAuthenticated,
      () => setPageTitle(translate("users.login.title")),
    ],
  },
  {
    path: PATH_LOGOUT,
    name: "Logout",
    beforeEnter: [() => useAuthStore().logout()],
  },
];
