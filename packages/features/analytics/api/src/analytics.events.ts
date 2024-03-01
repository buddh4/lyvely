import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  GRAPH_TYPE_SCORE,
  registerGraphType,
  ScoreGraphSeriesModel,
} from '@lyvely/analytics-interface';

@Injectable()
export class AnalyticsEvents implements OnModuleInit {
  onModuleInit(): any {
    registerGraphType({
      value: GRAPH_TYPE_SCORE,
      model: ScoreGraphSeriesModel,
    });
  }
}
