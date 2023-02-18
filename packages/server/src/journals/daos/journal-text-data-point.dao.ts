import { DataPointDao } from '@/time-series';
import { JournalTextDataPoint } from '../schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityIdentity } from '@/core';
import { User } from '@/users';

@Injectable()
export class JournalTextDataPointDao extends DataPointDao<JournalTextDataPoint> {
  @InjectModel(JournalTextDataPoint.name)
  protected model: Model<JournalTextDataPoint>;

  getModelConstructor(model?: Partial<JournalTextDataPoint>) {
    return JournalTextDataPoint;
  }

  getModuleId(): string {
    return 'journals';
  }

  async updateDataPointValue(
    uid: EntityIdentity<User>,
    dataPoint: JournalTextDataPoint,
    newValue: any,
  ): Promise<boolean> {
    return this.updateOneSetById(dataPoint, { value: newValue });
  }
}
