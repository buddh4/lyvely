import { ChartType, IChartSeriesDefinition } from '../interfaces';

export const CHART_SERIES_PROFILE_SCORE: IChartSeriesDefinition = {
  id: 'analytics-profile-score',
  chartTypes: [ChartType.Line, ChartType.Bar],
};
