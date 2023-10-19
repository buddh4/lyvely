import {
  IModule,
  MENU_PROFILE_DRAWER,
  registerFeatures,
  registerLayouts,
  registerMenuEntries,
  registerRoutes,
  useProfileMenu,
} from '@lyvely/web';
import { ACTIVITIES_MENU, ACTIVITIES_MODULE_ID, LAYOUT_ACTIVITIES } from '@/activities.constants';
import { ActivitiesFeatures } from '@/activities.features';
import { activitiesRoutes } from '@/routes';

export default () => {
  return {
    id: ACTIVITIES_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
    init() {
      registerRoutes(activitiesRoutes);
      registerFeatures([ActivitiesFeatures]);
      registerLayouts([
        {
          id: LAYOUT_ACTIVITIES,
          component: () => import('./layouts/ActivityLayout.vue'),
        },
      ]);
      registerMenuEntries(MENU_PROFILE_DRAWER, [
        {
          id: 'activities',
          text: 'activities.profile-drawer.title',
          icon: 'activity',
          sortOrder: 1500,
          moduleId: ACTIVITIES_MODULE_ID,
          condition: useProfileMenu(ACTIVITIES_MENU).hasEnabledEntries,
          to: { name: 'Activities' }, // TODO: maybe implement router which saves last activity route
        },
      ]);
    },
  } as IModule;
};
