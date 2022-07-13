import { assureObjectId, EntityData, EntityIdentity } from './db.utils';
import { FilterQuery, HydratedDocument, Model, QueryWithHelpers, UpdateQuery, QueryOptions } from 'mongoose';
import { assignEntityData, BaseEntity, createBaseEntityInstance } from './base.entity';
import { Inject } from '@nestjs/common';
import { ModelCreateEvent } from './dao.events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Constructor } from '@nestjs/common/utils/merge-with-values.util';
import { DeepPartial } from "lyvely-common";

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

export interface FetchQueryFilterOptions<T extends BaseEntity<T>> {
  excludeIds?: EntityIdentity<T>[] | EntityIdentity<T>
}

export interface FetchQueryOptions<T extends BaseEntity<T>> extends FetchQueryFilterOptions<T>{
  pagination?: Pagination,
  sort?: QuerySort<T>,
}

export const defaultFetchOptions = {
  pagination: {
    page: 1,
    limit: 100
  }
}

export interface UpsertQueryOptions {
  new?: boolean;
}

export type PartialEntityData<T extends BaseEntity<T>> = Partial<EntityData<T>>;

export abstract class AbstractDao<T extends BaseEntity<T>> {
  protected model: Model<BaseEntity>;

  @Inject()
  private eventEmitter: EventEmitter2;

  abstract getModelConstructor(model?: DeepPartial<T>): Constructor<T>;
  abstract getModuleId(): string;

  protected getModelName() {
    return this.model.modelName;
  }

  protected getModelType() : string|null {
    return null;
  }

  protected createEventName(event: string) {
    const type = this.getModelType() ? `${this.getModelType()}.` : '';
    return `model.${type}${this.getModelName().toLowerCase()}.${event}`;
  }

  protected emit(event: string, ...values: any[]) {
    return this.eventEmitter.emit(this.createEventName(event), values)
  }

  async save(entityData: T): Promise<T> {
    await this.beforeSave(entityData);
    this.emit('create.pre', new ModelCreateEvent(this, entityData, this.getModelName()));
    const result = <any> await new this.model(entityData).save();
    const model = this.constructModel(result.toObject({ virtuals: true, aliases: true, getters: true }));
    this.emit(`create.post`, new ModelCreateEvent(this, model, this.getModelName()));
    return await this.afterSave(model);
  }

  constructModel(lean?: DeepPartial<T>): T {
    return lean ? createBaseEntityInstance(this.getModelConstructor(lean), lean) : null;
  }

  protected async beforeSave(create: T): Promise<PartialEntityData<T>> {
    return Promise.resolve(create);
  }

  protected async afterSave(model: T): Promise<T> {
    return Promise.resolve(model);
  }

  async findById(id: EntityIdentity<T>): Promise<T|null> {
    return this.constructModel(await this.model.findById(assureObjectId(id)).lean());
  }

  protected createModels(leanArr?: Partial<T>[]): T[] {
    return leanArr.map(lean => this.constructModel(lean));
  }

  async findAllByIds(ids: T['_id'][], options: FetchQueryOptions<T> = defaultFetchOptions): Promise<T[]> {
    return this.findAll({ '_id': { $in: ids } }, options);
  }

  async findAll<C = T>(filter: FilterQuery<C>, options: FetchQueryOptions<T> = defaultFetchOptions): Promise<T[]> {
    const query = this.model.find(filter);
    const fetchFilter = this.getFetchQueryFilter(options);
    if(fetchFilter) {
      query.where(fetchFilter);
    }
    return this.createModels(await this.applyFetchQueryOptions(query, options).lean());
  }

  async findOne<C = T>(filter: FilterQuery<C>): Promise<T|null> {
    return this.constructModel(await this.model.findOne(filter).lean());
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

  async updateOneByIdSet(id: EntityIdentity<T>, updateSet: UpdateQuerySet<T>): Promise<number> {
    return this.updateOneById(id, { $set: <any> updateSet });
  }

  async updateOneByIdPull(id: EntityIdentity<T>, updateSet: UpdateQuerySet<T>): Promise<number> {
    return this.updateOneById(id, { $pull: <any> updateSet });
  }

  async updateOneById(id: EntityIdentity<T>, update: UpdateQuery<T>, options?: QueryOptions) {
    if(!await this.beforeUpdate(id, update)) return 0;
    const modifiedCount = (await this.model.updateOne({ _id: assureObjectId(id) }, update, options).exec()).modifiedCount;

    // TODO: DeepCopy
    if(modifiedCount && typeof id === 'object' && '$set' in update) {
      Object.keys(update['$set']).forEach(key => {
        if(id.hasOwnProperty(key)) {
          id[key] = update['$set'][key];
        }
      });
    }

    // TODO: DeepCopy
    if(modifiedCount && typeof id === 'object' && '$push' in update) {
      Object.keys(update['$push']).forEach(key => {
        if(id.hasOwnProperty(key) && Array.isArray(id[key])) {
          id[key] = id[key] ?? [];
          if(Array.isArray(id[key])) {
            id[key].push(update['$push'][key]);
          }
        }
      });
    }

    return modifiedCount;
  }

  protected async beforeUpdate(id: EntityIdentity<T>, update: UpdateQuery<T>, options?: QueryOptions): Promise<PartialEntityData<T>|boolean> {
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

  async deleteMany(filter: FilterQuery<T>): Promise<number> {
    return (await this.model.deleteMany(filter)).deletedCount;
  }

  async deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    return (await this.model.deleteOne(filter)).deletedCount === 1;
  }
}
