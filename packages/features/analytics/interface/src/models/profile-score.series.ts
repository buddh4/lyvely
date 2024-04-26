import { IChartSeriesDefinition } from '../interfaces';
import { TIME_SERIES_CHART } from './time-series-chart.category';
import { TimeSeriesConfigModel } from './time-series-config.model';

export const CHART_SERIES_PROFILE_SCORE: IChartSeriesDefinition = {
  id: 'analytics-profile-score',
  configType: TimeSeriesConfigModel,
  categoryTypes: [TIME_SERIES_CHART.id],
} as const;
