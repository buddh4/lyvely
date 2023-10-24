import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from '@lyvely/core';
import { TimeSeriesContentDao } from '../daos';
import { TestTimeSeriesContent } from './test-time-series-content.schema';

@Injectable()
export class TestTimeSeriesContentDao extends TimeSeriesContentDao<TestTimeSeriesContent> {
  @InjectModel(TestTimeSeriesContent.name)
  model: Model<TestTimeSeriesContent>;

  getModuleId(): string {
    return 'test';
  }

  getModelConstructor() {
    return TestTimeSeriesContent;
  }
}
