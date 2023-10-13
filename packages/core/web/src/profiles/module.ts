import { registerGuards, registerRoutes } from '@/lyvely.router';
import routes from './routes/profile.routes';
import { profileLayoutGuard } from './guards/profile.guards';
import { registerMenuEntries, registerMenuEntry } from '@/menus';
import { MENU_PROFILE_DRAWER } from '@/profiles/profile.constants';
import { isMultiUserProfile } from '@lyvely/core-interface';
import { useProfileStore } from '@/profiles/stores';
import { IModule } from '@/core';

export default () => {
  return {
    getId: () => 'profiles',
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
    },
    init: () => {
      registerRoutes(routes);
      registerGuards([profileLayoutGuard]);
      registerMenuEntries(MENU_PROFILE_DRAWER, [
        {
          id: 'profileUsers',
          to: { name: 'ProfileUsers' },
          icon: 'users',
          sortOrder: 3000,
          title: 'profiles.users.label',
          condition: () => {
            const { profile } = useProfileStore();
            return profile ? isMultiUserProfile(profile) : false;
          },
        },
        {
          id: 'profileSettings',
          to: { name: 'ProfileSettings' },
          icon: 'settings',
          sortOrder: 4000,
          title: 'profiles.settings.label',
        },
      ]);
    },
  } as IModule;
};
