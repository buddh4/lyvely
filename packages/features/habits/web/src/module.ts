import {
  IModule,
  MENU_PROFILE_DRAWER,
  MENU_PROFILE_MOBILE_FOOTER,
  registerContentType,
  translation,
  useProfileFeatureStore,
} from '@lyvely/web';
import { registerMenuEntry } from '@lyvely/ui';
import {
  CreateHabitModel,
  HabitModel,
  HABITS_MODULE_ID,
  HabitsFeature,
  ActivityHabitsFeature,
} from '@lyvely/habits-interface';
import { habitRoutes } from '@/routes';
import { calendarPlanModule } from '@lyvely/calendar-plan-web';
import { timeSeriesModule } from '@lyvely/time-series-web';

export default () => {
  return {
    id: HABITS_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
    dependencies: [calendarPlanModule(), timeSeriesModule()],
    features: [HabitsFeature, ActivityHabitsFeature],
    routes: habitRoutes,
    init: () => {
      registerMenuEntry(MENU_PROFILE_DRAWER, () => ({
        id: 'profile-habits',
        moduleId: HABITS_MODULE_ID,
        text: 'habits.title',
        sortOrder: 1501,
        feature: HabitsFeature.id,
        icon: 'activity',
        condition: !useProfileFeatureStore().isFeatureEnabled(ActivityHabitsFeature.id),
        to: { name: 'Habits' },
      }));
      registerMenuEntry(MENU_PROFILE_MOBILE_FOOTER, () => {
        return {
          id: 'habits-footer',
          moduleId: HABITS_MODULE_ID,
          text: 'habits.title',
          sortOrder: 1501,
          feature: HabitsFeature.id,
          icon: 'activity',
          condition: !useProfileFeatureStore().isFeatureEnabled(ActivityHabitsFeature.id),
          to: { name: 'Habits' },
        };
      });
      registerContentType({
        type: HabitModel.contentType,
        moduleId: HABITS_MODULE_ID,
        name: translation('habits.name'),
        icon: 'activity',
        feature: HabitsFeature.id,
        modelClass: HabitModel,
        interfaces: {
          create: {
            mode: 'modal',
            modelClass: CreateHabitModel,
            component: () => import('./components/modals/UpsertHabitModal.vue'),
          },
          edit: {
            mode: 'modal',
            component: () => import('./components/modals/UpsertHabitModal.vue'),
          },
          stream: {
            details: () => import('./components/content-stream/HabitDetails.vue'),
            entry: () => import('./components/content-stream/HabitStreamEntry.vue'),
          },
        },
      });
    },
  } as IModule;
};
