import { NumberDataPoint } from '../schemas';
import { DataPointDao } from './data-point.dao';
import { EntityIdentity } from '@/core';
import { User } from '@/users';

export abstract class NumberDataPointDao<T extends NumberDataPoint> extends DataPointDao<T> {
  async updateDataPointValue(uid: EntityIdentity<User>, dataPoint: T, newValue: number) {
    return await this.updateOneSetById(dataPoint, { value: newValue });
  }
}
