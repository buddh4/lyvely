import { Document, Types } from 'mongoose';
import { DeepPartial } from '@lyvely/common';
type TObjectId = Types.ObjectId;
export type EntityType<C, ID = TObjectId> = C & IEntity<ID>;
export interface IEntity<ID = TObjectId> {
    _id: ID;
}
export type DocumentType<T> = T & Document;
export declare abstract class BaseEntity<C, ID = TObjectId> implements IEntity<ID> {
    constructor(obj?: DeepPartial<C> | false);
    init(obj?: DeepPartial<C> | false): void;
    afterInit(): void;
    _id: ID;
    id: string;
}
export declare function assignEntityData<T extends Record<string, any>, U>(instance: T, obj?: U): T;
export {};
