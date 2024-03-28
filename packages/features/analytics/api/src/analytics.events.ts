import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  CHART_SERIES_PROFILE_SCORE,
  registerChartSeries,
  CHART_SERIES_TAG_SCORE,
  CHART_SERIES_USER_SCORE,
  ChartSeriesData,
} from '@lyvely/analytics-interface';
import { Chart, ChartSeriesConfig } from './schemas';
import { ProfileContext } from '@lyvely/api';

export class FetchSeriesDataEvent {
  private result?: Promise<ChartSeriesData[]>;

  readonly chart: Chart;

  readonly context: ProfileContext;

  readonly config: ChartSeriesConfig;

  constructor(chart: Chart, context: ProfileContext, config: ChartSeriesConfig) {
    this.chart = chart;
    this.context = context;
    this.config = config;
  }

  isSeriesType<T extends ChartSeriesConfig = ChartSeriesConfig>(
    config: ChartSeriesConfig,
    type: string,
  ): config is T {
    return config.type === type;
  }

  setResult(result: Promise<ChartSeriesData[]>) {
    this.result = result;
  }

  getResult(): Promise<ChartSeriesData[]> | undefined {
    return this.result;
  }
}

@Injectable()
export class AnalyticsEvents implements OnModuleInit {
  static EVENT_FETCH_SERIES_DATA = 'analytics-fetch-series-data';

  onModuleInit(): any {
    registerChartSeries(
      CHART_SERIES_PROFILE_SCORE,
      CHART_SERIES_USER_SCORE,
      CHART_SERIES_TAG_SCORE,
    );
  }
}
