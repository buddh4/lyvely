import { IFeature } from '@lyvely/interface';
import { ANALYTICS_MODULE_ID, CHART_SERIES_TYPE_SCORE } from './analytics.constants';

export const AnalyticsFeature: IFeature = {
  id: 'analytics',
  title: 'analytics.feature.title',
  description: 'analytics.feature.description',
  moduleId: ANALYTICS_MODULE_ID,
  installable: true,
  configurable: false,
  enabledByDefault: true,
};
