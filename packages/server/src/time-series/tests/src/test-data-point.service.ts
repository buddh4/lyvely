import { TestNumberTimingDataPoint } from './test-data-point.schema';
import { Injectable , Inject } from '@nestjs/common';
import { DataPointService } from "../../services";
import { TestTimeSeriesContent } from "./test-time-series-content.schema";
import { Profile } from "../../../profiles";
import { TestNumberDataPointDao } from "./test-data-point.dao";
import { User } from "../../../users";

@Injectable()
export class TestNumberDataPointService extends DataPointService<TestTimeSeriesContent, TestNumberTimingDataPoint, number> {

  @Inject()
  protected dataPointDao: TestNumberDataPointDao;

  async updateDataPointValue(profile: Profile, user: User, log: TestNumberTimingDataPoint, model: TestTimeSeriesContent, value: number): Promise<TestNumberTimingDataPoint> {
    await this.dataPointDao.updateOneSet(log, { value: value });
    log.value = value;
    return log;
  }
}
