import { TestDataPoint, TestNumberDataPoint, TestTimedNumberDataPoint } from './test-data-point.schema';
import { Injectable , Inject } from '@nestjs/common';
import { DataPointService, NumberDataPointService } from "../../services";
import { TestNumberTimeSeriesContent, TestTimeSeriesContent } from "./test-time-series-content.schema";
import { TestNumberDataPointDao, TestTimedNumberDataPointDao } from "./test-number-data-point.dao";
import { Profile } from "../../../profiles";
import { User } from "../../../users";

@Injectable()
export class TestDataPointService extends DataPointService<TestTimeSeriesContent, TestDataPoint> {

  @Inject()
  protected dataPointDao: TestNumberDataPointDao;

  protected updateDataPointValue(profile: Profile, user: User, dataPoint: TestDataPoint, model: TestTimeSeriesContent, newValue: any) {
    // Nothing todo...
  }
}

@Injectable()
export class TestNumberDataPointService extends NumberDataPointService<TestNumberTimeSeriesContent, TestNumberDataPoint> {

  @Inject()
  protected dataPointDao: TestNumberDataPointDao;
}

@Injectable()
export class TestTimedNumberDataPointService extends NumberDataPointService<TestNumberTimeSeriesContent, TestTimedNumberDataPoint> {

  @Inject()
  protected dataPointDao: TestTimedNumberDataPointDao;
}
