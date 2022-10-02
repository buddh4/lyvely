import { ifNotAuthenticated } from "@/router/utils";
import { translate } from "@/i18n";
import { setPageTitle } from "@/modules/core/store/page.store";

export default [
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/UserRegistrationView.vue"),
    beforeEnter: [
      ifNotAuthenticated,
      () => setPageTitle(translate("user-registration.title")),
    ],
  },
];
