import { ContentTypeDao, Model } from '@lyvely/api';
import { Chart } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { ANALYTICS_MODULE_ID } from '@lyvely/analytics-interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChartsDao extends ContentTypeDao<Chart> {
  @InjectModel(Chart.name)
  protected model: Model<Chart>;

  getModelConstructor() {
    return Chart;
  }

  getModuleId(): string {
    return ANALYTICS_MODULE_ID;
  }
}
