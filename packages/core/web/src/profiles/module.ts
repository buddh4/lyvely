import { registerGuards } from '@/lyvely.router';
import routes from './routes/profile.routes';
import { profileLayoutGuard } from './guards';
import { registerMenuEntries } from '@/menus';
import { MENU_PROFILE_DRAWER, MENU_PROFILE_SETTINGS } from '@/profiles/profile.constants';
import { isMultiUserProfile, PROFILES_MODULE_ID } from '@lyvely/core-interface';
import { useProfileStore } from '@/profiles/stores';
import { IModule } from '@/core';
import { computed } from 'vue';

export default () => {
  return {
    id: PROFILES_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
    },
    routes,
    init: () => {
      registerGuards([profileLayoutGuard]);
      registerMenuEntries(MENU_PROFILE_DRAWER, [
        {
          id: 'profileUsers',
          moduleId: PROFILES_MODULE_ID,
          to: { name: 'ProfileUsers' },
          icon: 'users',
          sortOrder: 3000,
          title: 'profiles.users.label',
          condition: computed(() => {
            const { profile } = useProfileStore();
            return !!profile && isMultiUserProfile(profile);
          }),
        },
        {
          id: 'profileSettings',
          moduleId: PROFILES_MODULE_ID,
          to: { name: 'ProfileSettings' },
          icon: 'settings',
          sortOrder: 4000,
          title: 'profiles.settings.label',
        },
      ]);

      // TODO: Permissions
      registerMenuEntries(MENU_PROFILE_SETTINGS, [
        {
          id: 'ProfileMembership',
          moduleId: PROFILES_MODULE_ID,
          title: 'profiles.settings.membership.label',
          sortOrder: 1000,
          to: { name: 'ProfileMembershipSettings' },
        },
        {
          id: 'GeneralProfileSettings',
          moduleId: PROFILES_MODULE_ID,
          title: 'profiles.settings.general.label',
          sortOrder: 2000,
          to: { name: 'GeneralProfileSettings' },
        },
      ]);
    },
  } as IModule;
};
