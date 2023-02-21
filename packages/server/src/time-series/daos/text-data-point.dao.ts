import { TextDataPoint } from '../schemas';
import { DataPointDao } from './data-point.dao';
import { EntityIdentity } from '@/core';
import { User } from '@/users';

export abstract class TextDataPointDao<T extends TextDataPoint> extends DataPointDao<T> {
  async updateDataPointValue(uid: EntityIdentity<User>, dataPoint: T, newValue: string) {
    return await this.updateOneSetById(dataPoint, { value: newValue });
  }
}
