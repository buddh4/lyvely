import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ScoreStatistics } from '@lyvely/common';

@Controller('statistics')
export class StatisticsController {
  @Inject()
  private statisticsService: StatisticsService;

  /*@Get('monthly')
  @UseInterceptors(ClassSerializerInterceptor)
  async getMonthlyStatistics(@Request() req): Promise<ScoreStatistics> {
    //return this.statisticsService.getMonthlyCategoryScoreStatistics(req.user, 2021, ['Health']);
    return this.statisticsService.getMonthlyScoreStatistics(req.user, 2021);
  }*/
}
