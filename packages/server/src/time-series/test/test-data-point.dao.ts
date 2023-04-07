import { Injectable } from '@nestjs/common';
import { DataPoint, DataPointDao, InjectDataPointModel } from '@/time-series';
import { TestTimeSeriesContent } from '@/time-series/test';
import { Model } from 'mongoose';

@Injectable()
export class TestDataPointDao extends DataPointDao {
  @InjectDataPointModel(TestTimeSeriesContent.name)
  protected model: Model<DataPoint>;

  protected contentName = TestTimeSeriesContent.name;

  getModuleId(): string {
    return 'test';
  }
}
