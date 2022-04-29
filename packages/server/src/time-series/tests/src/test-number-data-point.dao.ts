import {
  TestNumberDataPoint,
  TestNumberDataPointDocument, TestTimedNumberDataPoint, TestTimedNumberDataPointDocument
} from './test-data-point.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NumberDataPointDao } from "../../daos/number-data-point.dao";
import { TimedNumberDataPointDao } from "../../daos/timed-number-data-point.dao";

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

@Injectable()
export class TestTimedNumberDataPointDao extends TimedNumberDataPointDao<TestTimedNumberDataPoint> {

  @InjectModel(TestTimedNumberDataPoint.name)
  model: Model<TestTimedNumberDataPointDocument>;

  getModelConstructor() {
    return TestTimedNumberDataPoint;
  }

  getModuleId(): string {
    return 'test';
  }
}
