import {
  IModule,
  MENU_PROFILE_DRAWER,
  MENU_PROFILE_MOBILE_FOOTER,
  registerRoutes,
  useProfileFeatureStore,
} from '@lyvely/web';
import { registerLayouts, registerMenuEntries, registerMenuEntry } from '@lyvely/ui';
import { MENU_ACTIVITIES, ACTIVITIES_MODULE_ID, LAYOUT_ACTIVITIES } from '@/activities.constants';
import { activitiesRoutes } from '@/routes';
import { ActivityHabitsFeature } from '@lyvely/habits-web';
import { ActivityTasksFeature } from '@lyvely/tasks-web';
import { ActivitiesFeature } from '@/activities.features';
import { ActivityMilestonesFeature } from '@lyvely/milestones-web';

export default () => {
  return {
    id: ACTIVITIES_MODULE_ID,
    features: [ActivitiesFeature],
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
    init() {
      registerRoutes(activitiesRoutes);
      registerLayouts([
        {
          id: LAYOUT_ACTIVITIES,
          component: () => import('./layouts/ActivityLayout.vue'),
        },
      ]);

      registerMenuEntry(MENU_PROFILE_DRAWER, () => {
        const { isFeatureEnabled } = useProfileFeatureStore();
        return {
          id: 'activities',
          text: 'activities.profile-drawer.title',
          icon: 'activity',
          sortOrder: 1500,
          moduleId: ACTIVITIES_MODULE_ID,
          condition:
            isFeatureEnabled(ActivityMilestonesFeature.id) ||
            isFeatureEnabled(ActivityTasksFeature.id) ||
            isFeatureEnabled(ActivityHabitsFeature.id),
          to: { name: 'Activities' },
        };
      });

      registerMenuEntry(MENU_PROFILE_MOBILE_FOOTER, () => {
        const { isFeatureEnabled } = useProfileFeatureStore();
        return {
          id: 'activities-footer',
          text: 'activities.profile-drawer.title',
          icon: 'activity',
          sortOrder: 1500,
          moduleId: ACTIVITIES_MODULE_ID,
          condition:
            isFeatureEnabled(ActivityMilestonesFeature.id) ||
            isFeatureEnabled(ActivityTasksFeature.id) ||
            isFeatureEnabled(ActivityHabitsFeature.id),
          to: { name: 'Activities' },
        };
      });

      registerMenuEntries(MENU_ACTIVITIES, [
        {
          id: 'activities-habits',
          text: 'habits.name',
          moduleId: ACTIVITIES_MODULE_ID,
          icon: 'activity',
          features: ActivityHabitsFeature.id,
          to: { name: 'ActivityHabits' },
        },
        {
          id: 'activities-tasks',
          text: 'tasks.title',
          moduleId: ACTIVITIES_MODULE_ID,
          icon: 'task',
          features: ActivityTasksFeature.id,
          to: { name: 'ActivityTasks' },
        },
        {
          id: 'activities-milestones',
          text: 'milestones.title',
          moduleId: ACTIVITIES_MODULE_ID,
          icon: 'target',
          features: ActivityMilestonesFeature.id,
          to: { name: 'ActivityMilestones' },
        },
      ]);
    },
  } as IModule;
};
