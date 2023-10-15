import { registerMenuEntries } from '@/menus';
import { MENU_PROFILE_SETTINGS } from '@/profiles/profile.constants';
import { IModule } from '@/core';
import { registerRoutes } from '@/lyvely.router';
import { FeatureRoutes } from './routes';

export default () => {
  return {
    getId: () => 'features',
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
    },
    init: () => {
      registerRoutes(FeatureRoutes);
      registerMenuEntries(MENU_PROFILE_SETTINGS, [
        {
          id: 'ProfileFeatureSettings',
          title: 'features.settings.title',
          sortOrder: 3000,
          to: { name: 'ProfileFeatureSettings' },
        },
      ]);
    },
  } as IModule;
};
