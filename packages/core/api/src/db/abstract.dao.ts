import {
  applyUpdateTo,
  assureObjectId,
  EntityData,
  EntityIdentity,
  createBaseEntityInstance,
} from './db.utils';
import {
  FilterQuery,
  HydratedDocument,
  Model,
  QueryWithHelpers,
  UpdateQuery,
  QueryOptions,
  ClientSession,
  ProjectionType,
  MongooseBulkWriteOptions,
} from 'mongoose';
import { BaseEntity } from './base.entity';
import { Inject, Logger } from '@nestjs/common';
import { ModelSaveEvent } from './dao.events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeepPartial, Constructor } from '@lyvely/common';
import { cloneDeep } from 'lodash';

interface IPagination {
  page: number;
  limit: number;
}
type ContainsDot = `${string}.${string}`;

export type UpdateQuerySet<T extends BaseEntity<T>> = UpdateQuery<T>['$set'];
export type UpdateQueryUnset<T extends BaseEntity<T>> = UpdateQuery<T>['$unset'];

type UpdateSubQuerySet<T extends BaseEntity<T>> = Partial<Omit<T, '_id' | '__v' | 'id'>> & {
  [key: ContainsDot]: any;
};

type SortableRecord<T extends BaseEntity<T>> = Partial<Omit<T, '__v' | 'id'>> & {
  [key: ContainsDot]: any;
};

export type QuerySort<T extends BaseEntity<T>> = {
  [P in keyof SortableRecord<T>]: 1 | -1 | 'asc' | 'desc';
};

type EntityQuery<T extends BaseEntity<T>> = QueryWithHelpers<
  // eslint-disable-next-line @typescript-eslint/ban-types
  Array<HydratedDocument<T, any, any>>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  HydratedDocument<T, any, any>,
  any,
  T
>;

export interface IBaseQueryOptions {
  session?: ClientSession | null;
  discriminator?: string;
}

export interface IBulkBaseQueryOptions {
  session?: ClientSession;
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

export interface IFindAndUpdateQueryOptions<T extends BaseEntity<T>>
  extends IBaseFetchQueryOptions<T>,
    IUpdateQueryOptions {
  new?: boolean;
  upsert?: boolean;
  raw?: boolean;
}

export type SaveOptions = IBaseQueryOptions;
export type DeleteOptions = IBaseQueryOptions;

export interface IFetchQueryFilterOptions<T extends BaseEntity<T>>
  extends IBaseFetchQueryOptions<T> {
  excludeIds?: EntityIdentity<T>[] | EntityIdentity<T>;
}

export interface IFetchQueryOptions<T extends BaseEntity<T>> extends IFetchQueryFilterOptions<T> {
  pagination?: IPagination;
  limit?: number;
}

export const defaultFetchOptions = {
  pagination: {
    page: 1,
    limit: 100,
  },
};

export type PartialEntityData<T extends BaseEntity<T>> = Partial<EntityData<T>>;

export abstract class AbstractDao<T extends BaseEntity<T>> {
  protected abstract model: Model<T>;
  protected logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  @Inject()
  private eventEmitter: EventEmitter2;

  abstract getModelConstructor(model: DeepPartial<T>): Constructor<T>;
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
  protected getModelType(): string | null {
    return null;
  }

  protected getModelName() {
    return this.getModel().modelName;
  }

  protected constructModel(lean: DeepPartial<T>): T {
    return createBaseEntityInstance(this.getModelConstructor(lean), lean);
  }

  protected constructModels(leanArr: Partial<T>[]): T[] {
    return leanArr.map((lean) => this.constructModel(lean)) || [];
  }

  protected emit(event: string, data: any) {
    return this.eventEmitter.emit(this.createEventName(event), data);
  }

  async save(entityData: T, options?: SaveOptions): Promise<T> {
    await this.beforeSave(entityData);
    this.emit('save.pre', new ModelSaveEvent(this, entityData, this.getModelName()));
    const entityModel = this.getModel(options);
    const result = await new entityModel(entityData).save(options);
    const model = this.constructModel(
      result.toObject({ virtuals: true, aliases: true, getters: true }),
    );
    entityData._id = model._id;
    entityData.id = model.id;
    this.emit(`save.post`, new ModelSaveEvent(this, model, this.getModelName()));
    return await this.afterSave(model);
  }

  async saveMany(entityDataArr: T[], options?: SaveOptions): Promise<T[]> {
    for (const entityData of entityDataArr) {
      await this.beforeSave(entityData);
      this.emit('save.pre', new ModelSaveEvent(this, entityData, this.getModelName()));
    }

    const rawModels = await this.getModel(options).insertMany(entityDataArr, {
      lean: true,
      ...options,
    });

    const result: T[] = [];
    for (const rawModel of rawModels) {
      const model = this.constructModel(rawModel);
      this.emit(`save.post`, new ModelSaveEvent(this, model, this.getModelName()));
      result.push(await this.afterSave(model));
    }

    return result;
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
  async findById(
    identity: EntityIdentity<T>,
    options?: IBaseFetchQueryOptions<T>,
  ): Promise<T | null> {
    // TODO: trigger events
    const model = await this.getModel(options)
      .findById(this.assureEntityId(identity), options?.projection, options)
      .lean();

    return model ? this.constructModel(model) : null;
  }

  async findByIdAndFilter(
    identity: EntityIdentity<T>,
    filter?: FilterQuery<T>,
    options?: IBaseFetchQueryOptions<T>,
  ): Promise<T | null> {
    filter ||= {};
    filter._id = this.assureEntityId(identity);
    return this.findOne(filter, options);
  }

  async findAllByIds(ids: EntityIdentity<T>[], options?: IFetchQueryOptions<T>): Promise<T[]> {
    return this.findAll({ _id: { $in: ids.map((id) => this.assureEntityId(id)) } }, options);
  }

  async findAll(filter: FilterQuery<T>, options?: IFetchQueryOptions<T>): Promise<T[]> {
    options ??= {};

    const query = this.getModel(options).find(filter, options?.projection, options);
    const fetchFilter = this.getFetchQueryFilter(options);
    if (fetchFilter) {
      query.where(fetchFilter);
    }

    return this.constructModels(await this.applyFetchQueryOptions(query, options).lean());
  }

  protected assureEntityId(identity: EntityIdentity<T>): T['_id'] {
    return assureObjectId(identity);
  }

  async findOne<C = T>(
    filter: FilterQuery<C>,
    options?: IBaseFetchQueryOptions<T>,
  ): Promise<T | null> {
    // TODO: trigger events
    const model = await this.getModel(options).findOne(filter, options?.projection, options).lean();
    return model ? this.constructModel(model) : null;
  }

  async upsert(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: IUpsertQueryOptions = {},
  ): Promise<T | null> {
    options.new ??= true;
    const model = await this.getModel(options)
      .findOneAndUpdate(filter, update, { upsert: true, ...options })
      .lean();
    return model ? this.constructModel(model) : null;
  }

  protected getFetchQueryFilter(options: IFetchQueryFilterOptions<T>): FilterQuery<any> | null {
    const { excludeIds } = options;

    if (!excludeIds) {
      return null;
    }

    return {
      _id: Array.isArray(excludeIds)
        ? { $nin: excludeIds.map((identity) => this.assureEntityId(identity)) }
        : { $ne: this.assureEntityId(excludeIds) },
    };
  }

  protected applyFetchQueryOptions(
    query: EntityQuery<T>,
    options: IFetchQueryOptions<T>,
  ): EntityQuery<T> {
    const { sort, pagination } = options;

    if (sort) {
      query.sort(sort);
    }

    if (pagination) {
      query.limit(pagination.limit);
      query.skip((pagination.page - 1) * pagination.limit);
    }

    return query;
  }

  async findOneAndSetById(
    id: EntityIdentity<T>,
    updateSet: UpdateQuerySet<T>,
    options?: IFindAndUpdateQueryOptions<T>,
  ): Promise<T | null> {
    return this.findOneAndUpdateById(id, { $set: updateSet }, options);
  }

  async findOneAndUpdateById(
    id: EntityIdentity<T>,
    update: UpdateQuery<T>,
    options?: IFindAndUpdateQueryOptions<T>,
  ): Promise<T | null> {
    return this.findOneAndUpdateByFilter(id, update, {}, options);
  }

  async findOneAndUpdateSetByFilter(
    id: EntityIdentity<T>,
    update: UpdateQuerySet<T>,
    filter?: FilterQuery<T>,
    options?: IFindAndUpdateQueryOptions<T>,
  ): Promise<T | null> {
    return this.findOneAndUpdateByFilter(id, { $set: update }, filter, options);
  }

  async findOneAndUpdateByFilter(
    id: EntityIdentity<T>,
    update: UpdateQuery<T>,
    filter?: FilterQuery<T>,
    options?: IFindAndUpdateQueryOptions<T>,
  ): Promise<T | null> {
    // TODO: trigger events
    if (!(await this.beforeUpdate(id, update))) return null;

    options = options || {};
    if (typeof options.new === 'undefined') {
      options.new = true;
    }

    filter = filter || {};
    filter._id = this.assureEntityId(id);

    const data = await this.getModel(options)
      .findOneAndUpdate(filter, cloneDeep(update), options)
      .lean();

    if (!data) {
      return null;
    }

    if (!options || options.apply !== false) {
      applyUpdateTo(id, update);
    }

    return this.constructModel(data);
  }

  async updateOneSetById(
    id: EntityIdentity<T>,
    updateSet: UpdateQuerySet<T>,
    options?: IBaseQueryOptions,
  ) {
    return this.updateOneById(id, { $set: updateSet }, options);
  }

  async updateOneUnsetById(
    id: EntityIdentity<T>,
    updateUnset: UpdateQueryUnset<T>,
    options?: IBaseQueryOptions,
  ) {
    return this.updateOneById(id, { $unset: updateUnset }, options);
  }

  async updateOneById(
    id: EntityIdentity<T>,
    update: UpdateQuery<T>,
    options?: IUpdateQueryOptions,
  ) {
    return this.updateOneByFilter(id, update, {}, options);
  }

  protected async updateOneByFilter(
    identity: EntityIdentity<T>,
    update: UpdateQuery<T>,
    filter?: FilterQuery<T>,
    options?: QueryOptions,
  ): Promise<boolean> {
    // TODO: trigger events
    const clonedUpdate = cloneDeep(update);

    if (!(await this.beforeUpdate(identity, clonedUpdate))) return false;

    filter = filter || {};
    filter._id = this.assureEntityId(identity);

    const query = this.getModel(options).updateOne(filter, clonedUpdate, options);
    const modifiedCount = (await query.exec()).modifiedCount;

    if (modifiedCount && (!options || options.apply !== false)) {
      /**
       * TODO: In case a pre or post hook changes the update, this will not be reflected, we could use query.getUpdate()
       * but the result contains NestedDocs which would overwrite our sub model types at the moment.
       */
      applyUpdateTo(identity, update);
    }

    return !!modifiedCount;
  }

  protected getModel(options?: IBaseQueryOptions) {
    let model = this.model;

    if (options?.discriminator) {
      const discirminator =
        model.discriminators?.[options.discriminator] ||
        model.discriminators?.[this.model.modelName + '.' + options.discriminator];
      model = discirminator || model;
    }

    if (!model && options?.discriminator) {
      this.logger.warn('Invalid discriminator value: ' + options.discriminator);
    }

    return model || this.model;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async beforeUpdate(
    id: EntityIdentity<T>,
    update: UpdateQuery<T>,
  ): Promise<PartialEntityData<T> | boolean> {
    return Promise.resolve(true);
  }

  async updateSetBulk(
    updates: { id: EntityIdentity<T>; update: UpdateQuerySet<T> }[],
    options?: IBaseQueryOptions,
  ) {
    await this.getModel(options).bulkWrite(
      updates.map((update) => ({
        updateOne: {
          filter: <any>{ _id: this.assureEntityId(update.id) },
          update: <any>{ $set: update.update },
        },
      })),
      <MongooseBulkWriteOptions>options,
    );
  }

  async reload(id: EntityIdentity<T>): Promise<T | null> {
    return this.findById(id);
  }

  async deleteManyByIds(ids: EntityIdentity<T>[], options?: DeleteOptions): Promise<number> {
    return this.deleteMany({ _id: { $in: ids.map((id) => this.assureEntityId(id)) } }, options);
  }

  async deleteMany(filter: FilterQuery<T>, options?: DeleteOptions): Promise<number> {
    return (await this.getModel(options).deleteMany(filter, options)).deletedCount;
  }

  async deleteOne(filter: FilterQuery<T>, options?: DeleteOptions): Promise<boolean> {
    return (await this.getModel(options).deleteOne(filter, options)).deletedCount === 1;
  }
}
