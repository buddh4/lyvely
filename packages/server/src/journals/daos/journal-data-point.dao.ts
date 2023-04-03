import { DataPointDao } from '@/time-series';
import { JournalDataPoint, JournalNumberDataPoint } from '../schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataPointValueType } from '@lyvely/common';

@Injectable()
export class JournalDataPointDao extends DataPointDao<JournalDataPoint> {
  @InjectModel(JournalDataPoint.name)
  protected model: Model<JournalDataPoint>;

  getModelConstructor(model?: Partial<JournalDataPoint>) {
    switch (model.valueType) {
      case DataPointValueType
    }
    return model.valueType === DataPointValueType.Text
      ? JournalTextDataPoint
      : JournalNumberDataPoint;
  }

  getModuleId(): string {
    return 'journals';
  }
}
