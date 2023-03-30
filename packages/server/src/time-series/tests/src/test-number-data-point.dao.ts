import { TestNumberDataPoint, TestNumberDataPointDocument } from './test-data-point.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NumberDataPointDao } from '../../data-points/daos/number-data-point.dao';

@Injectable()
export class TestNumberDataPointDao extends NumberDataPointDao<TestNumberDataPoint> {
  @InjectModel(TestNumberDataPoint.name)
  model: Model<TestNumberDataPointDocument>;

  getModelConstructor() {
    return TestNumberDataPoint;
  }

  getModuleId(): string {
    return 'test';
  }
}
