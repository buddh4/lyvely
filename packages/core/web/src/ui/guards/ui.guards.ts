import { NavigationGuardNext, RouteLocation } from 'vue-router';
import { usePageStore } from '../stores';
import { isMaxViewSize, resolveLayoutComponent } from '@lyvely/ui';
import { start as startProgress, done as stopProgress } from 'nprogress';

export const showLoaderProgress = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
) => {
  if (to.name) startProgress();

  usePageStore().loaded = false;

  next();
};

export const resolveLayoutGuard = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
) => {
  if (to.meta.layout) {
    await resolveLayoutComponent(to.meta.layout);
  }
  next();
};

export const hideLoaderProgress = (): void => {
  stopProgress();
  usePageStore().loaded = true;
};

export const setHasHistory = (to: RouteLocation, from: RouteLocation): void => {
  if (from?.name) {
    usePageStore().hasHistory = true;
  }
};

export const showMobileNavGuard = (to: RouteLocation): void => {
  usePageStore().showMobileFooter = to.meta.showMobileFooter !== false;
};

export const closeMobileDrawerGuard = (): void => {
  if (isMaxViewSize('sm')) {
    usePageStore().showSidebar = false;
  }
};

export const hideAppLoader = (): void => {
  usePageStore().setShowAppLoader(false);
};
