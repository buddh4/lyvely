import { Document, Types, UpdateQuery } from 'mongoose';
import { BaseEntity } from './base.entity';
import { DeepPartial, Type } from '@lyvely/common';
export type EntityIdentity<T extends BaseEntity<any>> = T | Types.ObjectId | string | (Document & T);
export type EntityData<T> = Omit<T, '_id' | 'id' | '__v'>;
export declare function assureObjectId<T extends BaseEntity<any> = BaseEntity<any>, B extends boolean | undefined | null = boolean | undefined | null>(identity: EntityIdentity<T>, optional?: B): B extends true | undefined | null ? Types.ObjectId | undefined : Types.ObjectId;
export declare function applyUpdateTo<T extends BaseEntity<any>>(identity: EntityIdentity<T>, update: UpdateQuery<T>): void;
export declare function applyInc<T>(model: T, incData: Record<string, number>): void;
export declare function applyPush<T>(model: T, pushData: {
    [key in keyof T]?: any;
}): T;
export declare function applyRawDataTo<T>(model: T, data: {
    [key in keyof T]?: any;
}, { maxDepth, strict }?: {
    maxDepth?: number | undefined;
    strict?: boolean | undefined;
}): T;
export declare function assureStringId(obj: any, optional?: boolean): string | undefined;
export declare function createBaseEntityInstance<T>(constructor: Type<T>, data: DeepPartial<T>): any;
