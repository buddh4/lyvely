import {
  TestNumberTimingDataPoint,
  TestNumberTimingDataPointDocument
} from './test-data-point.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CalendarDateTime,
  CalendarIntervalEnum,
} from 'lyvely-common/src';
import { Constructor } from 'lyvely-common';
import { DataPointDao } from "../../daos/data-point.dao";

export class TimingDataPointIntervalFilter {
  constructor(public search: CalendarDateTime, public level: CalendarIntervalEnum = CalendarIntervalEnum.Unscheduled) {}
}

@Injectable()
export class TestNumberDataPointDao extends DataPointDao<TestNumberTimingDataPoint> {

  @InjectModel(TestNumberTimingDataPoint.name)
  model: Model<TestNumberTimingDataPointDocument>;

  getModelConstructor(): Constructor<TestNumberTimingDataPoint> {
    return TestNumberTimingDataPoint;
  }

  getModuleId(): string {
    return 'test';
  }
}
