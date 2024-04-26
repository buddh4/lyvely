import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  CHART_SERIES_PROFILE_SCORE,
  registerChartSeries,
  CHART_SERIES_TAG_SCORE,
  CHART_SERIES_USER_SCORE,
  ChartSeriesData,
  TIME_SERIES_CHART,
} from '@lyvely/analytics-interface';
import { Chart, ChartSeriesConfig, TimeSeriesChartConfig } from './schemas';
import { ProfileContext } from '@lyvely/api';
import { registerChartCategories } from './registries';

export class FetchSeriesDataEvent {
  private result?: Promise<ChartSeriesData[]>;

  readonly chart: Chart;

  readonly context: ProfileContext;

  readonly config: ChartSeriesConfig;

  readonly query?: Record<string, string>;

  constructor(
    chart: Chart,
    context: ProfileContext,
    config: ChartSeriesConfig,
    query?: Record<string, string>,
  ) {
    this.chart = chart;
    this.context = context;
    this.config = config;
    this.query = query;
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
    registerChartCategories([
      {
        type: TIME_SERIES_CHART,
        configModel: TimeSeriesChartConfig,
      },
    ]);
    registerChartSeries(
      CHART_SERIES_PROFILE_SCORE,
      CHART_SERIES_USER_SCORE,
      CHART_SERIES_TAG_SCORE,
    );
  }
}
