import { FilterQuery } from 'mongoose';

export class DBQuery {
  static or<T = any>(conditions: FilterQuery<T>[]): FilterQuery<T> {
    if (!conditions?.length) return {};
    if (conditions.length === 1) return conditions[0];
    return { $or: Object.assign({}, ...conditions) };
  }

  static and<T = any>(conditions: FilterQuery<T>[]): FilterQuery<T> {
    if (!conditions?.length) return {};
    if (conditions.length === 1) return conditions[0];
    return Object.assign({}, ...conditions);
  }
}
