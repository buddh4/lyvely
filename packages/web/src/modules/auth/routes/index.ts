import { ifNotAuthenticated } from "../guards";
import { translate } from "@/i18n";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { PATH_FORGOT_PASSWORD, PATH_LOGIN, PATH_LOGOUT } from "./paths";

export default [
  {
    path: PATH_LOGIN,
    name: "Login",
    meta: {
      title: () => translate("auth.login.title"),
    },
    component: () => import("../views/LoginView.vue"),
    beforeEnter: [ifNotAuthenticated],
  },
  {
    path: PATH_FORGOT_PASSWORD,
    name: "ForgotPassword",
    meta: {
      title: () => translate("auth.forgot_password.title"),
      isPublic: true,
    },
    component: () => import("../views/PasswordResetView.vue"),
    beforeEnter: [ifNotAuthenticated],
  },
  {
    path: PATH_LOGOUT,
    name: "Logout",
    beforeEnter: [() => useAuthStore().logout()],
  },
];
