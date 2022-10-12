import { isDevelopEnvironment } from "@/modules/core/environment";
import { NavigationGuardNext, RouteLocation } from "vue-router";

export const ifDevelopEnvironment = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
): void => {
  if (isDevelopEnvironment()) {
    next();
    return;
  }
  next("/404");
};
