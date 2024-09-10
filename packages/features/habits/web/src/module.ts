import {
  IModule,
  MENU_PROFILE_DRAWER,
  MENU_PROFILE_MOBILE_FOOTER,
  registerContentType,
  translation,
  useProfileFeatureStore,
  IContentSearchQuery,
  getProfileFeature,
} from '@lyvely/web';
import { registerMenuEntry } from '@lyvely/ui';
import {
  CreateHabitModel,
  HabitModel,
  HABITS_MODULE_ID,
  HabitsFeature,
  ActivityHabitsFeature,
  HabitPermissions,
  CHART_SERIES_HABIT_VALUE,
} from '@lyvely/habits-interface';
import { habitRoutes } from '@/routes';
import { calendarPlanModule } from '@lyvely/calendar-plan-web';
import { timeSeriesModule, TimeSeriesChartForm } from '@lyvely/time-series-web';
import { registerCharts } from '@lyvely/analytics-web';
import { ROUTES_HABITS_HOME } from '@/habits.constants';
import { computed } from 'vue';

export default () => {
  return {
    id: HABITS_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
    icon: 'habit',
    dependencies: [calendarPlanModule(), timeSeriesModule()],
    features: [HabitsFeature, ActivityHabitsFeature],
    routes: habitRoutes,
    permissions: HabitPermissions,
    init: () => {
      registerMenuEntry(MENU_PROFILE_DRAWER, () => ({
        id: 'profile-habits',
        moduleId: HABITS_MODULE_ID,
        text: 'habits.title',
        sortOrder: 1520,
        feature: HabitsFeature.id,
        icon: 'habit',
        condition: computed(() => {
          return (
            !getProfileFeature('activities') ||
            !useProfileFeatureStore().isFeatureEnabled(ActivityHabitsFeature.id)
          );
        }),
        to: { name: 'Habits' },
      }));
      registerMenuEntry(MENU_PROFILE_MOBILE_FOOTER, () => {
        return {
          id: 'habits-footer',
          moduleId: HABITS_MODULE_ID,
          text: 'habits.title',
          sortOrder: 1520,
          feature: HabitsFeature.id,
          icon: 'habit',
          condition: computed(() => {
            return (
              !getProfileFeature('activities') ||
              !useProfileFeatureStore().isFeatureEnabled(ActivityHabitsFeature.id)
            );
          }),
          to: { name: 'Habits' },
        };
      });
      registerCharts([
        {
          type: CHART_SERIES_HABIT_VALUE,
          label: 'habits.charts.value.label',
          description: 'habits.charts.value.info',
          form: TimeSeriesChartForm,
          formProps: {
            filter: { type: HabitModel.contentType } satisfies IContentSearchQuery,
          },
        },
      ]);
      registerContentType({
        type: HabitModel.contentType,
        moduleId: HABITS_MODULE_ID,
        name: translation('habits.name'),
        route: ROUTES_HABITS_HOME,
        feature: HabitsFeature.id,
        modelClass: HabitModel,
        interfaces: {
          upsert: {
            createModel: CreateHabitModel,
            component: () => import('./components/modals/UpsertHabitModal.vue'),
          },
          stream: {
            details: () => import('./components/content-stream/HabitDetails.vue'),
          },
        },
      });
    },
  } as IModule;
};
