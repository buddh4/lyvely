import { ifNotAuthenticated } from "@/router/utils";
import { translate } from "@/i18n";
import { setPageTitle } from "@/modules/core/store/page.store";

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
    beforeEnter: [
      ifNotAuthenticated,
      () => setPageTitle(translate("login.title")),
    ],
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/RegisterView.vue"),
    beforeEnter: [
      ifNotAuthenticated,
      () => setPageTitle(translate("register.title")),
    ],
  },
];
