import { Injectable, OnModuleInit } from '@nestjs/common';
import { CHART_SERIES_DEFINITION_SCORE, registerChartSeries } from '@lyvely/analytics-interface';

@Injectable()
export class AnalyticsEvents implements OnModuleInit {
  onModuleInit(): any {
    registerChartSeries(CHART_SERIES_DEFINITION_SCORE);
  }
}
