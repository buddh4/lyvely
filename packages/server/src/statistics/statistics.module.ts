import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityDataPoint, ActivityDataPointSchema } from '../activities/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityDataPoint.name, schema: ActivityDataPointSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
