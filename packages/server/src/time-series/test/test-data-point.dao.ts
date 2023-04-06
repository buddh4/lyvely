import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DataPoint, DataPointDao } from '@/time-series';
import { InjectDataPointModel } from '@/time-series/decorators/inject-data-point-model.decorator';
import { TestTimeSeriesContent } from '@/time-series/test/test-time-series-content.schema';

@Injectable()
export class TestDataPointDao extends DataPointDao {
  @InjectDataPointModel(TestTimeSeriesContent.name)
  model: Model<DataPoint>;

  getModuleId(): string {
    return 'test';
  }
}
