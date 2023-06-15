import { FilterQuery } from 'mongoose';
export declare class DBQuery {
    static or<T = any>(conditions: FilterQuery<T>[]): FilterQuery<T>;
    static and<T = any>(conditions: FilterQuery<T>[]): FilterQuery<T>;
}
