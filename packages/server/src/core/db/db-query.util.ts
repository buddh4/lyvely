import { FilterQuery } from 'mongoose';

export class DBQuery {
  static or<T = any>(conditions: FilterQuery<T>[]): FilterQuery<T> {
    return { $or: Object.assign({}, ...conditions) };
  }

  static and<T = any>(conditions: FilterQuery<T>[]): FilterQuery<T> {
    return Object.assign({}, ...conditions);
  }
}
