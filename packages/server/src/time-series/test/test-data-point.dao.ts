import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataPoint, DataPointDao, NumberDataPoint } from '@/time-series';

@Injectable()
export class TestDataPointDao extends DataPointDao {
  @InjectModel(DataPoint.name)
  model: Model<DataPoint>;

  getModuleId(): string {
    return 'test';
  }
}
