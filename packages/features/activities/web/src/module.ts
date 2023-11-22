import {
  IModule,
  MENU_PROFILE_DRAWER,
  MENU_PROFILE_MOBILE_FOOTER,
  registerRoutes,
  useProfileFeatureStore,
} from '@lyvely/web';
import { registerLayouts, registerMenuEntries } from '@lyvely/ui';
import { MENU_ACTIVITIES, ACTIVITIES_MODULE_ID, LAYOUT_ACTIVITIES } from '@/activities.constants';
import { activitiesRoutes } from '@/routes';
import { ActivityHabitsFeature } from '@lyvely/habits-web';
import { ActivityTasksFeature } from '@lyvely/tasks-web';
import { ActivitiesFeature } from '@/activities.features';
import { ActivityMilestonesFeature } from '@lyvely/milestones-web';
import { computed } from 'vue';

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

      registerMenuEntries(MENU_PROFILE_DRAWER, [
        {
          id: 'activities',
          text: 'activities.profile-drawer.title',
          icon: 'activity',
          sortOrder: 1500,
          moduleId: ACTIVITIES_MODULE_ID,
          condition: computed(() => {
            const featureStore = useProfileFeatureStore();
            return (
              featureStore.isFeatureEnabled(ActivityMilestonesFeature.id).value ||
              featureStore.isFeatureEnabled(ActivityTasksFeature.id).value ||
              featureStore.isFeatureEnabled(ActivityHabitsFeature.id).value
            );
          }),
          to: { name: 'Activities' }, // TODO: maybe implement router which saves last activity route
        },
      ]);

      registerMenuEntries(MENU_PROFILE_MOBILE_FOOTER, [
        {
          id: 'activities-footer',
          text: 'activities.profile-drawer.title',
          icon: 'activity',
          sortOrder: 1500,
          moduleId: ACTIVITIES_MODULE_ID,
          condition: computed(() => {
            const featureStore = useProfileFeatureStore();
            return (
              featureStore.isFeatureEnabled(ActivityMilestonesFeature.id).value ||
              featureStore.isFeatureEnabled(ActivityTasksFeature.id).value ||
              featureStore.isFeatureEnabled(ActivityHabitsFeature.id).value
            );
          }),
          to: { name: 'Activities' }, // TODO: maybe implement router which saves last activity route
        },
      ]);

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
