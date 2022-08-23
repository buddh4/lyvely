import Login from "@/modules/user/views/Login.vue";
import { ifNotAuthenticated } from "@/router/utils";
import Register from "@/modules/user/views/Register.vue";
import { translate } from "@/i18n";
import { setPageTitle } from "@/modules/core/store/page.store";

export default [
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: [ifNotAuthenticated, () => setPageTitle(translate('login.title'))]
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    beforeEnter: [ifNotAuthenticated, () => setPageTitle(translate('register.title'))]
  }
];
