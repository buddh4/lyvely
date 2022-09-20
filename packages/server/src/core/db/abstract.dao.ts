import { applyUpdateTo, assureObjectId, EntityData, EntityIdentity } from './db.utils';
import {
  FilterQuery,
  HydratedDocument,
  Model,
  QueryWithHelpers,
  UpdateQuery,
  QueryOptions,
  ClientSession,
  ProjectionType
} from 'mongoose';
import { BaseEntity } from './base.entity';
import { createBaseEntityInstance } from "./db.utils";
import { Inject } from '@nestjs/common';
import { ModelSaveEvent } from './dao.events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Constructor } from '@nestjs/common/utils/merge-with-values.util';
import { DeepPartial } from "@lyvely/common";
import { cloneDeep } from "lodash";

interface Pagination {
  page: number,
  limit: number
}
type ContainsDot = `${string}.${string}`;

export type UpdateQuerySet<T extends BaseEntity<T>> = Partial<Omit<T, '_id' | '__v' | 'id'>> | UpdateSubQuerySet<T>;
type UpdateSubQuerySet<T extends BaseEntity<T>> = Partial<Omit<T, '_id' | '__v' | 'id'>> & { [key:ContainsDot]: any };

type QuerySort<T extends BaseEntity<T>> = { [P in keyof UpdateQuerySet<T>]: 1 | -1 | 'asc' | 'desc' };

type EntityQuery<T extends BaseEntity<T>> = QueryWithHelpers<
  // eslint-disable-next-line @typescript-eslint/ban-types
  Array<HydratedDocument<T, any, any>>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  HydratedDocument<T, any, any>,
  any,
  T>

export interface BaseQueryOptions {
  session?: ClientSession
}

export interface UpdateQueryOptions extends BaseQueryOptions {
  apply?: boolean
}

export interface BaseFetchQueryOptions<T extends BaseEntity<T>> extends BaseQueryOptions {
  projection?: ProjectionType<T>;
  sort?: QuerySort<T>;
}

export interface FindAndUpdateQueryOptions<T extends BaseEntity<T>> extends BaseFetchQueryOptions<T>, UpdateQueryOptions {
  new?: boolean;
  upsert?: boolean;
  raw?: boolean;
}

export type SaveOptions = BaseQueryOptions;
export type DeleteOptions = BaseQueryOptions;

export interface FetchQueryFilterOptions<T extends BaseEntity<T>> extends BaseFetchQueryOptions<T> {
  excludeIds?: EntityIdentity<T>[] | EntityIdentity<T>
}

export interface FetchQueryOptions<T extends BaseEntity<T>> extends FetchQueryFilterOptions<T> {
  pagination?: Pagination,
  limit?: number
}

export const defaultFetchOptions = {
  pagination: {
    page: 1,
    limit: 100
  }
}

export interface UpsertQueryOptions  extends BaseQueryOptions {
  new?: boolean;
}

export type PartialEntityData<T extends BaseEntity<T>> = Partial<EntityData<T>>;

export abstract class AbstractDao<T extends BaseEntity<T>> {
  protected model: Model<any>;

  @Inject()
  private eventEmitter: EventEmitter2;

  abstract getModelConstructor(model?: DeepPartial<T>): Constructor<T>;
  abstract getModuleId(): string;

  protected createEventName(event: string) {
    const type = this.getModelType() ? `${this.getModelType()}.` : '';
    return `model.${type}${this.getModelName().toLowerCase()}.${event}`;
  }

  /**
   * Can be used to create typed event names. If not model type is specified all events
   * will be prefixed with `model.<model-name>`.
   *
   * @protected
   */
  protected getModelType() : string|null {
    return null;
  }

  protected getModelName() {
    return this.model.modelName;
  }

  protected constructModel(lean?: DeepPartial<T>): T {
    return lean ? createBaseEntityInstance(this.getModelConstructor(lean), lean) : null;
  }

  protected constructModels(leanArr?: Partial<T>[]): T[] {
    return leanArr.map(lean => this.constructModel(lean));
  }

  protected emit(event: string, data: any) {
    return this.eventEmitter.emit(this.createEventName(event), data)
  }

  async save(entityData: T, options?: SaveOptions): Promise<T> {
    await this.beforeSave(entityData);
    this.emit('save.pre', new ModelSaveEvent(this, entityData, this.getModelName()));
    const result = <any> await new this.model(entityData).save(options);
    const model = this.constructModel(result.toObject({ virtuals: true, aliases: true, getters: true }));
    entityData._id = model._id;
    entityData.id = model.id;
    this.emit(`save.post`, new ModelSaveEvent(this, model, this.getModelName()));
    return await this.afterSave(model);
  }

  /**
   * Can be overwritten by subclasses for additional checks, manipulation prior saving the data etc.
   * @param toCreate
   * @protected
   */
  protected async beforeSave(toCreate: T): Promise<PartialEntityData<T>> {
    return Promise.resolve(toCreate);
  }

  /**
   * Can be overwritten by subclasses for additional checks, manipulation after saving the data etc.
   * @param created
   * @protected
   */
  protected async afterSave(created: T): Promise<T> {
    return Promise.resolve(created);
  }

  /**
   * Finds an entity by given Identity. Returns the entity with the search id or null if no entity with the given
   * identity was found.
   * @param identity
   * @param options
   */
  async findById(identity: EntityIdentity<T>, options?: BaseFetchQueryOptions<T>): Promise<T|null> {
    // TODO: trigger events
    return this.constructModel(await this.model.findById(this.assureEntityId(identity), options?.projection, options).lean());
  }

  async findAllByIds(ids: EntityIdentity<T>[], options?: FetchQueryOptions<T>): Promise<T[]> {
    return this.findAll({ '_id': { $in: ids.map(id => this.assureEntityId(id)) } }, options);
  }

  async findAll<C = T>(filter: FilterQuery<C>, options?: FetchQueryOptions<T>): Promise<T[]> {
    // TODO: trigger events

    options = options || {};
    options.pagination = options.pagination || defaultFetchOptions.pagination;

    const query = this.model.find(filter, options?.projection, options);
    const fetchFilter = this.getFetchQueryFilter(options);
    if(fetchFilter) {
      query.where(fetchFilter);
    }
    return this.constructModels(await this.applyFetchQueryOptions(query, options).lean());
  }

  protected assureEntityId(identity: EntityIdentity<T>) : T['_id'] {
    return assureObjectId(identity);
  }

  async findOne<C = T>(filter: FilterQuery<C>, options?: BaseFetchQueryOptions<T>): Promise<T|null> {
    // TODO: trigger events
    return this.constructModel(await this.model.findOne(filter, options?.projection, options).lean());
  }

  // TODO: Implement + Test
  /*protected async upsert(filter: FilterQuery<T>, update: UpdateQuery<T>, options: UpsertQueryOptions = {}): Promise<T|null> {
    return this.constructModel(await this.model.findOneAndUpdate(filter, update, { upsert: true, ...options }).lean());
  }*/

  protected getFetchQueryFilter(options: FetchQueryFilterOptions<T>): FilterQuery<any> {
    const { excludeIds } = options;

    if(!excludeIds) {
      return;
    }

    return {
      '_id':  Array.isArray(excludeIds)
        ? { $nin: excludeIds.map(identity => this.assureEntityId(identity)) }
        : { $ne: this.assureEntityId(excludeIds) }
    }
  }

  protected applyFetchQueryOptions(query: EntityQuery<T>, options: FetchQueryOptions<T>): EntityQuery<T> {
    const { sort, pagination } = options;

    if(sort) {
      query.sort(sort)
    }

    if(pagination) {
      query.limit(pagination.limit)
      query.skip((pagination.page -1) * pagination.limit)
    }

    return query;
  }

  async findOneAndSetById(id: EntityIdentity<T>, updateSet: UpdateQuerySet<T>, options?: FindAndUpdateQueryOptions<T>): Promise<T|null> {
    return this.findOneAndUpdateById(id, { $set: <any> updateSet }, options);
  }

  async findOneAndUpdateById(id: EntityIdentity<T>, update: UpdateQuery<T>, options?: FindAndUpdateQueryOptions<T>): Promise<T|null> {
    return this.findOneAndUpdateByFilter(id, update, {}, options);
  }

  async findOneAndUpdateByFilter(id: EntityIdentity<T>, update: UpdateQuery<T>, filter?: FilterQuery<T>, options?: FindAndUpdateQueryOptions<T>): Promise<T|null> {
    // TODO: trigger events
    if(!await this.beforeUpdate(id, update)) return null;

    options = options || {};
    if(typeof options.new === 'undefined') {
      options.new = true;
    }

    filter = filter || {};
    filter._id = this.assureEntityId(id);

    const data = await this.model.findOneAndUpdate(filter, cloneDeep(update), options).lean();

    if(!data) {
      return null;
    }

    if(!options || options.apply !== false) {
      applyUpdateTo(id, update);
    }

    return this.constructModel(data);
  }

  async updateOneSetById(id: EntityIdentity<T>, updateSet: UpdateQuerySet<T>, options?: BaseQueryOptions): Promise<number> {
    return this.updateOneById(id, { $set: <any> updateSet }, options);
  }

  async updateOneById(id: EntityIdentity<T>, update: UpdateQuery<T>, options?: UpdateQueryOptions) {
    return this.updateOneByFilter(id, update, {}, options);
  }

  protected async updateOneByFilter(identity: EntityIdentity<T>, update: UpdateQuery<T>, filter?: FilterQuery<T>, options?: QueryOptions) {
    // TODO: trigger events
    const clonedUpdate = cloneDeep(update);

    if(!await this.beforeUpdate(identity, clonedUpdate)) return 0;

    filter = filter || {};
    filter._id = this.assureEntityId(identity);

    const modifiedCount = (await this.model.updateOne(filter, clonedUpdate, options).exec()).modifiedCount;

    if(modifiedCount && (!options || options.apply !== false)) {
      /**
       *  TODO: Note that applyUpdateTo does not set values which are not part of the model already (hasOwnProperty),
       *  this should be documented, a workaround is to set a default in the schema, maybe make the strict setting configurable
        */
      applyUpdateTo(identity, update);
    }

    return modifiedCount;
  }

  protected async beforeUpdate(id: EntityIdentity<T>, update: UpdateQuery<T>): Promise<PartialEntityData<T>|boolean> {
    return Promise.resolve(true);
  }

  async updateSetBulk(updates: { id: EntityIdentity<T>, update: UpdateQuerySet<T>}[], options?: BaseQueryOptions) {
     await this.model.bulkWrite(
        updates.map(update => ({
            updateOne: {
              filter: { _id: this.assureEntityId(update.id) },
              update: { $set: update.update },
            }
          })
      ), options);
  }

  async reload(id: EntityIdentity<T>): Promise<T> {
    return this.findById(id);
  }

  async deleteAll(options?: DeleteOptions): Promise<number> {
    return this.deleteMany({});
  }

  async deleteMany(filter: FilterQuery<T>, options?: DeleteOptions): Promise<number> {
    return (await this.model.deleteMany(filter, options)).deletedCount;
  }

  async deleteOne(filter: FilterQuery<T>, options?: DeleteOptions): Promise<boolean> {
    return (await this.model.deleteOne(filter, options)).deletedCount === 1;
  }
}