import {
  IModule,
  MENU_PROFILE_DRAWER,
  registerFeatures,
  registerMenuEntries,
  useProfileMenu,
} from '@lyvely/web';
import { ACTIVITIES_MENU, ACTIVITIES_MODULE_ID } from '@/activities.constants';
import { ActivitiesFeatures } from '@/activities.features';

export default () => {
  return {
    id: ACTIVITIES_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
    init() {
      const activitiesMenu = useProfileMenu(ACTIVITIES_MENU);
      registerFeatures([ActivitiesFeatures]);
      /* registerMenuEntries(MENU_PROFILE_DRAWER, [
        {
          id: 'activities',
          title: 'activities.profile-drawer.title',
          moduleId: ACTIVITIES_MODULE_ID,
          condition: useProfileMenu(ACTIVITIES_MENU).hasEnabledEntries,
          to: { name: 'Activities' }, // TODO: maybe implement router which saves last activity route
        },
      ]);*/
    },
  } as IModule;
};
