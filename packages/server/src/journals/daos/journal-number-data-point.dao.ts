import { DataPointDao } from '@/time-series';
import { JournalDataPoint, JournalNumberDataPoint, JournalTextDataPoint } from '../schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityIdentity } from '@/core';
import { User } from '@/users';
import { DataPointValueType } from '@lyvely/common';

@Injectable()
export class JournalNumberDataPointDao extends DataPointDao<JournalNumberDataPoint> {
  @InjectModel(JournalNumberDataPoint.name)
  protected model: Model<JournalNumberDataPoint>;

  getModelConstructor(model?: Partial<JournalNumberDataPoint>) {
    return JournalNumberDataPoint;
  }

  getModuleId(): string {
    return 'journals';
  }

  async updateDataPointValue(
    uid: EntityIdentity<User>,
    dataPoint: JournalNumberDataPoint,
    newValue: any,
  ): Promise<boolean> {
    return this.updateOneSetById(dataPoint, { value: newValue });
  }
}
