import { Inject } from '@nestjs/common';
import { Controller } from '@lyvely/api';
import { StatisticsService } from './statistics.service';

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
