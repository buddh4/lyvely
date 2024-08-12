import { Injectable, OnModuleInit } from '@nestjs/common';
import { registerChartSeries } from '@lyvely/analytics';
import { CHART_SERIES_HABIT_VALUE } from '@lyvely/habits-interface';

@Injectable()
export class HabitsEvents implements OnModuleInit {
  onModuleInit(): any {
    registerChartSeries(CHART_SERIES_HABIT_VALUE);
  }
}
