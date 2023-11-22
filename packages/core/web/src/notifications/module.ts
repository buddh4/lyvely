import { NOTIFICATIONS_MODULE_ID } from '@lyvely/interface';
import { IModule } from '@/core';
import { registerComponentStackEntries } from '@lyvely/ui';
import { STACK_PROFILE_TOP_RIGHT_NAVIGATION } from '@/profiles';
import NotificationDrawer from './components/NotificationDrawer.vue';

export default () => {
  return {
    id: NOTIFICATIONS_MODULE_ID,
    init: () => {
      registerComponentStackEntries(STACK_PROFILE_TOP_RIGHT_NAVIGATION, [
        {
          id: 'notification-drawer',
          component: NotificationDrawer,
          sortOrder: 200,
        },
      ]);
    },
  } as IModule;
};
