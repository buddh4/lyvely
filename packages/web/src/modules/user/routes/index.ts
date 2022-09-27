import { ifNotAuthenticated } from "@server/router/utils";
import { translate } from "@server/i18n";
import { setPageTitle } from "@server/modules/core/store/page.store";

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import('../views/Login.vue'),
    beforeEnter: [ifNotAuthenticated, () => setPageTitle(translate('login.title'))]
  },
  {
    path: "/register",
    name: "Register",
    component: () => import('../views/Register.vue'),
    beforeEnter: [ifNotAuthenticated, () => setPageTitle(translate('register.title'))]
  }
];
