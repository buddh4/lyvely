import { ifNotAuthenticated } from "../guards";
import { translate } from "@/i18n";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { PATH_LOGIN, PATH_LOGOUT } from "./paths";

export default [
  {
    path: PATH_LOGIN,
    name: "Login",
    meta: {
      title: () => translate("users.login.title"),
    },
    component: () => import("../views/LoginView.vue"),
    beforeEnter: [ifNotAuthenticated],
  },
  {
    path: PATH_LOGOUT,
    name: "Logout",
    beforeEnter: [() => useAuthStore().logout()],
  },
];
