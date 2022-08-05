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
import { BaseEntity, createBaseEntityInstance } from './base.entity';
import { Inject } from '@nestjs/common';
import { ModelSaveEvent } from './dao.events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Constructor } from '@nestjs/common/utils/merge-with-values.util';
import { DeepPartial } from "lyvely-common";
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

export interface BaseFetchQueryOptions<T extends BaseEntity<T>> extends BaseQueryOptions {
  projection?: ProjectionType<T>;
}

export interface FindAndUpdateQueryOptions<T extends BaseEntity<T>> extends BaseFetchQueryOptions<T> {
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
  sort?: QuerySort<T>,
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
  protected model: Model<BaseEntity>;

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
   * @param crated
   * @protected
   */
  protected async afterSave(crated: T): Promise<T> {
    return Promise.resolve(crated);
  }

  /**
   * Finds an entity by given Identity. Returns the entity with the search id or null if no entity with the given
   * identity was found.
   * @param identity
   * @param options
   */
  async findById(identity: EntityIdentity<T>, options?: BaseFetchQueryOptions<T>): Promise<T|null> {
    // TODO: trigger events
    return this.constructModel(await this.model.findById(assureObjectId(identity), options?.projection, options).lean());
  }

  async findAllByIds(ids: EntityIdentity<T>[], options: FetchQueryOptions<T> = defaultFetchOptions): Promise<T[]> {
    return this.findAll({ '_id': { $in: ids.map(id => assureObjectId(id)) } }, options);
  }

  async findAll<C = T>(filter: FilterQuery<C>, options: FetchQueryOptions<T> = defaultFetchOptions): Promise<T[]> {
    // TODO: trigger events
    const query = this.model.find(filter, options?.projection, options);
    const fetchFilter = this.getFetchQueryFilter(options);
    if(fetchFilter) {
      query.where(fetchFilter);
    }
    return this.constructModels(await this.applyFetchQueryOptions(query, options).lean());
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
        ? { $nin: excludeIds.map(assureObjectId) }
        : { $ne: assureObjectId(excludeIds) }
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

  async updateOneByIdSet(id: EntityIdentity<T>, updateSet: UpdateQuerySet<T>, options?: BaseQueryOptions): Promise<number> {
    return this.updateOneById(id, { $set: <any> updateSet }, options);
  }

  async findOneAndUpdateByIdSet(id: EntityIdentity<T>, updateSet: UpdateQuerySet<T>, options?: FindAndUpdateQueryOptions<T>): Promise<T|null> {
    return this.findOneAndUpdateById(id, { $set: <any> updateSet }, options);
  }

  async findOneAndUpdateById(id: EntityIdentity<T>, update: UpdateQuery<T>, options?: FindAndUpdateQueryOptions<T>): Promise<T|null> {
    // TODO: trigger events
    if(!await this.beforeUpdate(id, update)) return null;

    options = options || {};
    if(typeof options.new === 'undefined') {
      options.new = true;
    }

    const data = await this.model.findOneAndUpdate({ _id: assureObjectId(id) }, cloneDeep(update), options).lean();

    if(!data) {
      return null;
    }

    applyUpdateTo(id, update);

    return this.constructModel(data);
  }

  async updateOneById(id: EntityIdentity<T>, update: UpdateQuery<T>, options?: BaseQueryOptions) {
    return this._updateOneById(id, update, options);
  }

  protected async _updateOneById(id: EntityIdentity<T>, update: UpdateQuery<T>, options?: QueryOptions) {
    // TODO: trigger events
    const clonedUpdate = cloneDeep(update);

    if(!await this.beforeUpdate(id, clonedUpdate)) return 0;

    const modifiedCount = (await this.model.updateOne({ _id: assureObjectId(id) }, clonedUpdate, options).exec()).modifiedCount;

    if(modifiedCount) {
      applyUpdateTo(id, update);
    }

    return modifiedCount;
  }

  protected async beforeUpdate(id: EntityIdentity<T>, update: UpdateQuery<T>): Promise<PartialEntityData<T>|boolean> {
    return Promise.resolve(true);
  }

  async updateBulkSet(updates: { id: EntityIdentity<T>, update: UpdateQuerySet<T> }[]): Promise<number> {
    return (await this.model.bulkWrite(
      updates.map(update => ({
          updateOne: {
            filter: { _id: assureObjectId(update.id) },
            update: { $set: update.update },
          }
        })
      ))).modifiedCount;
  }

  async reload(id: EntityIdentity<T>): Promise<T> {
    return this.findById(id);
  }

  async deleteAll(): Promise<number> {
    return await this.deleteMany({});
  }

  async deleteMany(filter: FilterQuery<T>, options?: DeleteOptions): Promise<number> {
    return (await this.model.deleteMany(filter, options)).deletedCount;
  }

  async deleteOne(filter: FilterQuery<T>, options?: DeleteOptions): Promise<boolean> {
    return (await this.model.deleteOne(filter, options)).deletedCount === 1;
  }
}
