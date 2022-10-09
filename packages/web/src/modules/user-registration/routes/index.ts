import { ifNotAuthenticated } from "@/router/utils";
import { translate } from "@/i18n";
import { setPageTitle } from "@/modules/core/store/page.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { NavigationGuardNext, RouteLocation } from "vue-router";
import { useVerifyEmailStore } from "@/modules/user-registration/stores/verify-email.store";

export const PATH_REGISTER = "/register";
export const PATH_VERIFY_EMAIL = "/verify-email";

const ifAwaitingEmailVerification = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
): void => {
  if (useVerifyEmailStore().isAwaiting()) {
    next();
    return;
  }
  next("/");
};

export default [
  {
    path: PATH_REGISTER,
    name: "Register",
    component: () => import("../views/UserRegistrationView.vue"),
    meta: {
      isPublic: true,
    },
    beforeEnter: [
      ifNotAuthenticated,
      () => setPageTitle(translate("user_registration.title")),
    ],
  },
  {
    path: PATH_VERIFY_EMAIL,
    name: "VerifyEmail",
    component: () => import("../views/VerifyEmailView.vue"),
    meta: {
      isPublic: true,
    },
    beforeEnter: [
      ifNotAuthenticated,
      ifAwaitingEmailVerification,
      () =>
        setPageTitle(translate("user_registration.email_verification.title")),
    ],
  },
];
