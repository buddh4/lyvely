import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitDataPoint, HabitDataPointSchema } from '../activities/schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: HabitDataPoint.name, schema: HabitDataPointSchema }])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
