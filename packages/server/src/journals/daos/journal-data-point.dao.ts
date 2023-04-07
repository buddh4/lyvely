import { DataPoint, DataPointDao, InjectDataPointModel } from '@/time-series';
import { Injectable } from '@nestjs/common';
import { Journal } from '../schemas';
import { Model } from 'mongoose';

@Injectable()
export class JournalDataPointDao extends DataPointDao {
  @InjectDataPointModel(Journal.name)
  protected model: Model<DataPoint>;

  protected contentName = Journal.name;

  getModuleId(): string {
    return 'journals';
  }
}
