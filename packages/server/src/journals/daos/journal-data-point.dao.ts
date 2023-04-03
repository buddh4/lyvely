import { DataPoint, DataPointDao } from '@/time-series';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JournalDataPointDao extends DataPointDao {
  @InjectModel(DataPoint.name)
  protected model: Model<DataPoint>;

  getModuleId(): string {
    return 'journals';
  }
}
