import {
  IModule,
  MENU_PROFILE_DRAWER,
  MENU_PROFILE_MOBILE_FOOTER,
  registerContentType,
  registerRoutes,
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
    init: () => {
      const { isFeatureEnabled } = useProfileFeatureStore();
      registerMenuEntry(MENU_PROFILE_DRAWER, () => ({
        id: 'profile-habits',
        moduleId: HABITS_MODULE_ID,
        text: 'habits.title',
        sortOrder: 1501,
        features: HabitsFeature.id,
        icon: 'activity',
        condition: isFeatureEnabled(ActivityHabitsFeature.id),
        to: { name: 'Habits' },
      }));
      registerMenuEntry(MENU_PROFILE_MOBILE_FOOTER, () => ({
        id: 'profile-habits-footer',
        moduleId: HABITS_MODULE_ID,
        text: 'habits.title',
        sortOrder: 1501,
        features: HabitsFeature.id,
        icon: 'activity',
        condition: isFeatureEnabled(ActivityHabitsFeature.id),
        to: { name: 'Habits' },
      }));
      registerRoutes(habitRoutes);
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
            component: () => import('./components/modals/EditHabitModal.vue'),
          },
          edit: {
            mode: 'modal',
            component: () => import('./components/modals/EditHabitModal.vue'),
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
