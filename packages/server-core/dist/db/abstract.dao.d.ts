/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { EntityData, EntityIdentity } from './db.utils';
import { FilterQuery, HydratedDocument, Model, QueryWithHelpers, UpdateQuery, QueryOptions, ClientSession, ProjectionType } from 'mongoose';
import { BaseEntity } from './base.entity';
import { Logger } from '@nestjs/common';
import { Constructor } from '@nestjs/common/utils/merge-with-values.util';
import { DeepPartial } from '@lyvely/common';
interface IPagination {
    page: number;
    limit: number;
}
type ContainsDot = `${string}.${string}`;
export type UpdateQuerySet<T extends BaseEntity<T>> = UpdateQuery<T>['$set'];
export type UpdateQueryUnset<T extends BaseEntity<T>> = UpdateQuery<T>['$unset'];
type SortableRecord<T extends BaseEntity<T>> = Partial<Omit<T, '__v' | 'id'>> & {
    [key: ContainsDot]: any;
};
export type QuerySort<T extends BaseEntity<T>> = {
    [P in keyof SortableRecord<T>]: 1 | -1 | 'asc' | 'desc';
};
type EntityQuery<T extends BaseEntity<T>> = QueryWithHelpers<Array<HydratedDocument<T, any, any>>, HydratedDocument<T, any, any>, any, T>;
export interface IBaseQueryOptions {
    session?: ClientSession | null;
    discriminator?: string;
}
export interface IUpsertQueryOptions extends IBaseQueryOptions {
    new?: boolean;
}
export interface IUpdateQueryOptions extends IBaseQueryOptions {
    apply?: boolean;
}
export interface IBaseFetchQueryOptions<T extends BaseEntity<T>> extends IBaseQueryOptions {
    projection?: ProjectionType<T>;
    sort?: QuerySort<T>;
}
export interface IFindAndUpdateQueryOptions<T extends BaseEntity<T>> extends IBaseFetchQueryOptions<T>, IUpdateQueryOptions {
    new?: boolean;
    upsert?: boolean;
    raw?: boolean;
}
export type SaveOptions = IBaseQueryOptions;
export type DeleteOptions = IBaseQueryOptions;
export interface IFetchQueryFilterOptions<T extends BaseEntity<T>> extends IBaseFetchQueryOptions<T> {
    excludeIds?: EntityIdentity<T>[] | EntityIdentity<T>;
}
export interface IFetchQueryOptions<T extends BaseEntity<T>> extends IFetchQueryFilterOptions<T> {
    pagination?: IPagination;
    limit?: number;
}
export declare const defaultFetchOptions: {
    pagination: {
        page: number;
        limit: number;
    };
};
export type PartialEntityData<T extends BaseEntity<T>> = Partial<EntityData<T>>;
export declare abstract class AbstractDao<T extends BaseEntity<T>> {
    protected abstract model: Model<T>;
    protected logger: Logger;
    constructor();
    private eventEmitter;
    abstract getModelConstructor(model: DeepPartial<T>): Constructor<T>;
    abstract getModuleId(): string;
    protected createEventName(event: string): string;
    protected getModelType(): string | null;
    protected getModelName(): string;
    protected constructModel(lean?: DeepPartial<T> | null): T;
    protected constructModels(leanArr?: Partial<T>[]): T[];
    protected emit(event: string, data: any): boolean;
    save(entityData: T, options?: SaveOptions): Promise<T>;
    saveMany(entityDataArr: T[], options?: SaveOptions): Promise<T[]>;
    protected beforeSave(toCreate: T): Promise<PartialEntityData<T>>;
    protected afterSave(created: T): Promise<T>;
    findById(identity: EntityIdentity<T>, options?: IBaseFetchQueryOptions<T>): Promise<T | null>;
    findByIdAndFilter(identity: EntityIdentity<T>, filter?: FilterQuery<T>, options?: IBaseFetchQueryOptions<T>): Promise<T | null>;
    findAllByIds(ids: EntityIdentity<T>[], options?: IFetchQueryOptions<T>): Promise<T[]>;
    findAll(filter: FilterQuery<T>, options?: IFetchQueryOptions<T>): Promise<T[]>;
    protected assureEntityId(identity: EntityIdentity<T>): T['_id'];
    findOne<C = T>(filter: FilterQuery<C>, options?: IBaseFetchQueryOptions<T>): Promise<T | null>;
    upsert(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: IUpsertQueryOptions): Promise<T | null>;
    protected getFetchQueryFilter(options: IFetchQueryFilterOptions<T>): FilterQuery<any> | null;
    protected applyFetchQueryOptions(query: EntityQuery<T>, options: IFetchQueryOptions<T>): EntityQuery<T>;
    findOneAndSetById(id: EntityIdentity<T>, updateSet: UpdateQuerySet<T>, options?: IFindAndUpdateQueryOptions<T>): Promise<T | null>;
    findOneAndUpdateById(id: EntityIdentity<T>, update: UpdateQuery<T>, options?: IFindAndUpdateQueryOptions<T>): Promise<T | null>;
    findOneAndUpdateSetByFilter(id: EntityIdentity<T>, update: UpdateQuerySet<T>, filter?: FilterQuery<T>, options?: IFindAndUpdateQueryOptions<T>): Promise<T | null>;
    findOneAndUpdateByFilter(id: EntityIdentity<T>, update: UpdateQuery<T>, filter?: FilterQuery<T>, options?: IFindAndUpdateQueryOptions<T>): Promise<T | null>;
    updateOneSetById(id: EntityIdentity<T>, updateSet: UpdateQuerySet<T>, options?: IBaseQueryOptions): Promise<boolean>;
    updateOneUnsetById(id: EntityIdentity<T>, updateUnset: UpdateQueryUnset<T>, options?: IBaseQueryOptions): Promise<boolean>;
    updateOneById(id: EntityIdentity<T>, update: UpdateQuery<T>, options?: IUpdateQueryOptions): Promise<boolean>;
    protected updateOneByFilter(identity: EntityIdentity<T>, update: UpdateQuery<T>, filter?: FilterQuery<T>, options?: QueryOptions): Promise<boolean>;
    protected getModel(options?: IBaseQueryOptions): Model<T, {}, {}, {}, import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T> & Omit<import("mongoose").Require_id<T>, never>>, any>;
    protected beforeUpdate(id: EntityIdentity<T>, update: UpdateQuery<T>): Promise<PartialEntityData<T> | boolean>;
    updateSetBulk(updates: {
        id: EntityIdentity<T>;
        update: UpdateQuerySet<T>;
    }[], options?: IBaseQueryOptions): Promise<void>;
    reload(id: EntityIdentity<T>): Promise<T | null>;
    deleteManyByIds(ids: EntityIdentity<T>[], options?: DeleteOptions): Promise<number>;
    deleteMany(filter: FilterQuery<T>, options?: DeleteOptions): Promise<number>;
    deleteOne(filter: FilterQuery<T>, options?: DeleteOptions): Promise<boolean>;
}
export {};
