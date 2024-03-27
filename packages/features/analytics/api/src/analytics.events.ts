import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  CHART_SERIES_PROFILE_SCORE,
  registerChartSeries,
  CHART_SERIES_TAG_SCORE,
  CHART_SERIES_USER_SCORE,
} from '@lyvely/analytics-interface';

@Injectable()
export class AnalyticsEvents implements OnModuleInit {
  onModuleInit(): any {
    registerChartSeries(
      CHART_SERIES_PROFILE_SCORE,
      CHART_SERIES_USER_SCORE,
      CHART_SERIES_TAG_SCORE,
    );
  }
}
