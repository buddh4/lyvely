import { DataPoint, DataPointDao } from '@/time-series';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectDataPointModel } from '@/time-series/decorators/inject-data-point-model.decorator';
import { Journal } from '../schemas';

@Injectable()
export class JournalDataPointDao extends DataPointDao {
  @InjectDataPointModel(Journal.name)
  protected model: Model<DataPoint>;

  getModuleId(): string {
    return 'journals';
  }
}
