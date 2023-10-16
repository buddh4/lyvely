import { registerMenuEntries } from '@/menus';
import { MENU_PROFILE_SETTINGS } from '@/profiles/profile.constants';
import { IModule } from '@/core';
import { FeatureRoutes } from './routes';
import { FEATURE_MODULE_ID } from '@lyvely/core-interface';

export default () => {
  return {
    id: FEATURE_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
    },
    routes: FeatureRoutes,
    init: () => {
      registerMenuEntries(MENU_PROFILE_SETTINGS, [
        {
          id: 'ProfileFeatureSettings',
          moduleId: FEATURE_MODULE_ID,
          title: 'features.settings.title',
          sortOrder: 3000,
          to: { name: 'ProfileFeatureSettings' },
        },
      ]);
    },
  } as IModule;
};
