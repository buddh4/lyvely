import { DataPoint, DataPointStrategyDao, NumberDataPoint } from '@/time-series';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import module from '../activities.meta';

@Injectable()
export class HabitDataPointDao extends DataPointStrategyDao<NumberDataPoint> {
  @InjectModel(DataPoint.name)
  protected model: Model<NumberDataPoint>;

  getModuleId(): string {
    return module.id;
  }

  getModelConstructor() {
    return NumberDataPoint;
  }
}
