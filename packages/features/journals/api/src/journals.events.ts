import { Injectable, OnModuleInit } from '@nestjs/common';
import { registerChartSeries } from '@lyvely/analytics';
import { CHART_SERIES_JOURNAL_VALUE } from '@lyvely/journals-interface';

@Injectable()
export class JournalsEvents implements OnModuleInit {
  onModuleInit(): any {
    registerChartSeries(CHART_SERIES_JOURNAL_VALUE);
  }
}
