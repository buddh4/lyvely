import { NOTIFICATIONS_MODULE_ID } from '@lyvely/interface';
import { IModule } from '@/core';
import { registerComponentStackEntry } from '@lyvely/ui';
import { STACK_PROFILE_TOP_RIGHT_NAVIGATION } from '@/profiles';
import { useAuthStore } from '@/auth';

export default () => {
  return {
    id: NOTIFICATIONS_MODULE_ID,
    init: () => {
      registerComponentStackEntry(STACK_PROFILE_TOP_RIGHT_NAVIGATION, {
        id: 'notification-drawer',
        component: () => import('./components/NotificationDrawer.vue'),
        condition: () => useAuthStore().isAuthenticated,
        sortOrder: 200,
      });
    },
  } as IModule;
};
