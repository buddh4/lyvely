import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitDataPoint, ActivityDataPointSchema } from '../activities/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HabitDataPoint.name, schema: ActivityDataPointSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
