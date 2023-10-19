import { profileRoute, useProfileMenu } from '@lyvely/web';
import { useActivityStore } from '@/stores';
import { RouteRecordRaw } from 'vue-router';
import { ACTIVITIES_MENU } from '@/activities.constants';

export const activitiesRoutes = [
  {
    name: 'Activities',
    path: profileRoute('/activities'),
    redirect() {
      const activitiesMenu = useProfileMenu(ACTIVITIES_MENU);
      if (!activitiesMenu.hasEnabledEntries.value) return '/404';

      const viewName = useActivityStore().activeView;
      if (viewName) return { name: viewName };

      return activitiesMenu.enabledMenuEntries.value[0].to;
    },
  },
] as RouteRecordRaw[];
