import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NumberDataPoint, NumberDataPointDao } from '@/time-series';

@Injectable()
export class TestNumberDataPointDao extends NumberDataPointDao {
  @InjectModel(NumberDataPoint.name)
  model: Model<NumberDataPoint>;

  getModelConstructor() {
    return NumberDataPoint;
  }

  getModuleId(): string {
    return 'test';
  }
}
