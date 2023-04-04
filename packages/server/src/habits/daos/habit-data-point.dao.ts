import { DataPoint, DataPointStrategyDao, NumberDataPoint } from '@/time-series';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class HabitDataPointDao extends DataPointStrategyDao<NumberDataPoint> {
  @InjectModel(DataPoint.name)
  protected model: Model<NumberDataPoint>;

  getModuleId(): string {
    return 'habits';
  }

  getModelConstructor() {
    return NumberDataPoint;
  }
}
