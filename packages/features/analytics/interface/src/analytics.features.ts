import { IFeature } from '@lyvely/interface';
import { ANALYTICS_MODULE_ID, GRAPH_TYPE_SCORE } from './analytics.constants';
import { registerGraphType } from './registries';

export const AnalyticsFeature: IFeature = {
  id: 'analytics',
  title: 'analytics.feature.title',
  description: 'analytics.feature.description',
  moduleId: ANALYTICS_MODULE_ID,
  installable: true,
  configurable: false,
  enabledByDefault: true,
};
