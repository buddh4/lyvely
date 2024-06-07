import {
  ANALYTICS_MODULE_ID,
  AnalyticsFeature,
  ChartModel,
  CreateChartModel,
  CHART_SERIES_PROFILE_SCORE,
  CHART_SERIES_USER_SCORE,
  TIME_SERIES_CHART,
  TimeSeriesConfigModel,
  TimeSeriesChartType,
} from '@lyvely/analytics-interface';
import { registerMenuEntry, registerSvgIcon } from '@lyvely/ui';
import {
  IModule,
  isMultiUserProfile,
  MENU_PROFILE_DRAWER,
  registerContentType,
  t,
  translation,
  useProfileStore,
} from '@lyvely/web';
import { analyticsRoutes } from '@/routes/analytics.routes';
import { registerCharts, registerChartCategories } from '@/registries';
import { ROUTE_ANALYTICS_HOME } from '@/analytics.constants';

export default () => {
  return {
    id: ANALYTICS_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
    features: [AnalyticsFeature],
    routes: analyticsRoutes,
    init: () => {
      registerChartCategories([
        {
          type: TIME_SERIES_CHART,
          label: 'analytics.categories.time_series.label',
          component: () => import('./components/charts/TimeSeriesChart.vue'),
        },
      ]);
      registerCharts([
        {
          type: CHART_SERIES_PROFILE_SCORE,
          label: 'analytics.series.score-profile.label',
          description: 'analytics.series.score-profile.info',
          initModel() {
            return new TimeSeriesConfigModel({
              name: t('analytics.series.score-profile.init-label'),
              chartType: TimeSeriesChartType.Line,
            });
          },
          form: () => import('./components/forms/ProfileScoreSeriesForm.vue'),
        },
        {
          type: CHART_SERIES_USER_SCORE,
          label: 'analytics.series.score-user.label',
          description: 'analytics.series.score-user.info',
          condition: () => isMultiUserProfile(useProfileStore().profile),
          form: () => import('./components/forms/UserScoreSeriesForm.vue'),
        },
      ]);

      registerMenuEntry(MENU_PROFILE_DRAWER, () => ({
        id: 'analytics',
        moduleId: ANALYTICS_MODULE_ID,
        text: 'analytics.title',
        sortOrder: 1550,
        feature: AnalyticsFeature.id,
        icon: 'statistics',
        to: { name: 'Analytics' },
      }));

      registerSvgIcon({
        name: 'add-chart',
        viewBox: '0 0 24 24',
        paths: [
          'M18 18.984v-4.969h2.016v4.969q0 0.797-0.609 1.406t-1.406 0.609h-14.016q-0.797 0-1.383-0.609t-0.586-1.406v-13.969q0-0.797 0.586-1.406t1.383-0.609h12v2.016h-12v13.969h14.016zM20.016 6.984h3v2.016h-3v3h-2.016v-3h-3v-2.016h3v-3h2.016v3zM9.984 6.984h2.016v9.984h-2.016v-9.984zM14.016 12.984h1.969v3.984h-1.969v-3.984zM6 9.984h2.016v6.984h-2.016v-6.984z',
        ],
      });

      registerContentType({
        type: ChartModel.contentType,
        moduleId: ANALYTICS_MODULE_ID,
        name: translation('analytics.charts.name'),
        icon: 'statistics',
        route: ROUTE_ANALYTICS_HOME,
        feature: AnalyticsFeature.id,
        modelClass: ChartModel<any>,
        interfaces: {
          upsert: {
            createModel: CreateChartModel,
            component: () => import('./components/modals/UpsertChartModal.vue'),
          },
          stream: {
            details: () => import('./components/content-stream/ChartDetails.vue'),
          },
        },
      });
    },
  } as IModule;
};
