import {
  IModule,
  MENU_PROFILE_DRAWER,
  MENU_PROFILE_MOBILE_FOOTER,
  registerRoutes,
  useProfileFeatureStore,
} from '@lyvely/web';
import {
  registerLayouts,
  registerMenuEntries,
  registerMenuEntry,
  registerSvgIcon,
} from '@lyvely/ui';
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
      registerSvgIcon({
        name: 'habits',
        paths: [
          'M21.984 5.203l-11.391 11.391-4.266-4.219 1.453-1.406 2.813 2.813 9.984-9.984zM12 20.016q-1.641 0-3.094-0.633t-2.555-1.734-1.734-2.555-0.633-3.094 0.633-3.094 1.734-2.555 2.555-1.734 3.094-0.633q1.172 0 2.25 0.328t2.016 0.938l1.453-1.453q-1.219-0.844-2.672-1.313t-3.047-0.469q-2.063 0-3.867 0.773t-3.188 2.156-2.156 3.188-0.773 3.867 0.773 3.867 2.156 3.188 3.188 2.156 3.867 0.773q1.313 0 2.508-0.305t2.273-0.914l-1.5-1.5q-0.75 0.375-1.57 0.563t-1.711 0.188zM18.984 15h-3v2.016h3v3h2.016v-3h3v-2.016h-3v-3h-2.016v3z',
        ],
        viewBox: '0 0 24 24',
      });
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
          icon: 'habits',
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
          icon: 'habits',
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
          feature: ActivityHabitsFeature.id,
          to: { name: 'ActivityHabits' },
        },
        {
          id: 'activities-tasks',
          text: 'tasks.title',
          moduleId: ACTIVITIES_MODULE_ID,
          icon: 'task',
          feature: ActivityTasksFeature.id,
          to: { name: 'ActivityTasks' },
        },
        {
          id: 'activities-milestones',
          text: 'milestones.title',
          moduleId: ACTIVITIES_MODULE_ID,
          icon: 'target',
          feature: ActivityMilestonesFeature.id,
          to: { name: 'ActivityMilestones' },
        },
      ]);
    },
  } as IModule;
};
