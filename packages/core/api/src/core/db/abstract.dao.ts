import {
  applyUpdateTo,
  assureObjectId,
  EntityData,
  DocumentIdentity,
  createBaseDocumentInstance,
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
import { BaseDocument } from './base.document';
import { CollationOptions } from 'mongodb';
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

export type UpdateQuerySet<T extends BaseDocument<T>> = UpdateQuery<T>['$set'];
export type UpdateQueryUnset<T extends BaseDocument<T>> = UpdateQuery<T>['$unset'];

type SortableRecord<T extends BaseDocument<T>> = Partial<Omit<T, '__v' | 'id'>> & {
  [key: ContainsDot]: any;
};

export type QuerySort<T extends BaseDocument<T>> = {
  [P in keyof SortableRecord<T>]: 1 | -1 | 'asc' | 'desc';
};

type EntityQuery<T extends BaseDocument<T>> = QueryWithHelpers<
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
  collation?: CollationOptions;
}

export interface IUpdateQueryOptions extends IBaseQueryOptions {
  apply?: boolean;
  collation?: CollationOptions;
}

export interface IBaseFetchQueryOptions<T extends BaseDocument<T>> extends IBaseQueryOptions {
  projection?: ProjectionType<T>;
  sort?: QuerySort<T>;
  collation?: CollationOptions;
}

export interface IFindAndUpdateQueryOptions<T extends BaseDocument<T>>
  extends IBaseFetchQueryOptions<T>,
    IUpdateQueryOptions {
  new?: boolean;
  upsert?: boolean;
  raw?: boolean;
}

export type SaveOptions = IBaseQueryOptions;
export type DeleteOptions = IBaseQueryOptions;

export interface IFetchQueryFilterOptions<T extends BaseDocument<T>>
  extends IBaseFetchQueryOptions<T> {
  excludeIds?: DocumentIdentity<T>[] | DocumentIdentity<T>;
}

export interface IFetchQueryOptions<T extends BaseDocument<T>> extends IFetchQueryFilterOptions<T> {
  pagination?: IPagination;
  limit?: number;
}

export const DEFAULT_FETCH_LIMIT = 200;

export const defaultFetchOptions = {
  pagination: {
    page: 1,
    limit: DEFAULT_FETCH_LIMIT,
  },
};

export type PartialEntityData<T extends BaseDocument<T>> = Partial<EntityData<T>>;

/**
 * Abstract Data Access Object provides basic data access features for sub classes.
 * This class will hardly use the mongoose Model API but instead mainly utilizes the mongoose Query API, which means
 * we hardly interact with mongoose Models and mainly facilitate the `lean` function and do partial document updates like `$set`
 * manually. This class provides many helper functions to support writing fetch and update queries.
 * The advantage of this is that you can directly work with your model class instances and enables a better abstraction
 * by only using mongoose for data access and schema validation.
 *
 * Sub classes may extend this feature for complex queries or updates of a certain model.
 *
 * @example
 *
 * class MyModelDao extends AbstractDao<MyModel> {
 *   @InjectModel(MyModel.name)
 *   protected model: Model<MyModel>;
 *
 *   // This function is used to instantiate your model, you can return other constructors if required.
 *   getModelConstructor(model: DeepPartial<T>) {
 *     return model.type === 'special' ? MySpecialModel : MyModel;
 *   }
 *
 *   getModuleId() {
 *     return MY_MODULE_ID;
 *   }
 * }
 */
export abstract class AbstractDao<T extends BaseDocument<T>> {
  /**
   * The mongoose model, which is usually injected with @InjectModel()
   * @protected
   */
  protected abstract model: Model<T>;

  /**
   * Logger for logging error and debug information.
   * @protected
   */
  protected logger: Logger;

  /**
   * Base constructor, sets up the logger by default.
   */
  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Event emitter used to emit model related events when creating or updating a model.
   * @private
   */
  @Inject()
  private eventEmitter: EventEmitter2;

  /**
   * Subclasses need to return a model constructor which is used to instantiate model instances when
   * fetching models from the database.
   * Subclasses may return different constructor types e.g. by discriminator field of the given lean model.
   * This function is called by `constructModel`, if you have a more complex model creation scenario you may
   * want to overwrite `constructModel` instead, otherwise it is recommended to only overwrite this function.
   * @param leanModel
   */
  abstract getModelConstructor(leanModel: DeepPartial<T>): Constructor<T>;

  /**
   * Subclasses should return the related module id used for logging and potentially restrictions and policies.
   */
  abstract getModuleId(): string;

  /**
   * Builds an event name for this type of model used when emitting data access related events.
   * @param event
   * @protected
   */
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

  /**
   * Returns the name of this model.
   * @protected
   */
  protected getModelName() {
    return this.getModel().modelName;
  }

  /**
   * This function is used to create model instances from lean objects by facilitating the `getModelConstructor` function.
   * This function may be overwritten by subclasses in rare cases where the `getModelConstructor` is not sufficient e.g.
   * in cases we need to create the model by a factory.
   * @param lean
   * @protected
   */
  protected constructModel(lean: DeepPartial<T>): T {
    return createBaseDocumentInstance(this.getModelConstructor(lean), lean);
  }

  /**
   * This function is used to create multiple model instances from lean objects by facilitating the `constructModel` function
   * and is usually called by fetch queries.
   * @param lean
   * @protected
   */
  protected constructModels(leanArr: Partial<T>[]): T[] {
    return leanArr.map((lean) => this.constructModel(lean)) || [];
  }

  /**
   * Used to emit dao related events.
   * @param event
   * @param data
   * @protected
   */
  protected emit(event: string, data: any) {
    return this.eventEmitter.emit(this.createEventName(event), data);
  }

  /**
   * Saves an entity and triggers and `save.pre` in which the entity data could potentially be manipulated
   * and a `save.post` in which a save result may be manipulated.
   *
   * @param entityData
   * @param options
   */
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

  /**
   * Saves multiple entities and triggers and `save.pre` in which the entity data could potentially be manipulated
   * and a `save.post` in which a save result may be manipulated.
   * @param entityDataArr
   * @param options
   */
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
    identity: DocumentIdentity<T>,
    options?: IBaseFetchQueryOptions<T>,
  ): Promise<T | null> {
    const query = this.getModel(options).findById(
      this.assureEntityId(identity),
      options?.projection,
      options,
    );

    if (options?.collation) {
      query.collation(options.collation);
    }

    const model = await query.lean().exec();
    return model ? this.constructModel(model) : null;
  }

  /**
   * Finds an entity by id but only if it matches a given additional filter query.
   * This function can be applied if we want to make sure an entity with a known id matches certain constraints.
   * @param identity
   * @param filter
   * @param options
   */
  async findByIdAndFilter(
    identity: DocumentIdentity<T>,
    filter?: FilterQuery<T>,
    options?: IBaseFetchQueryOptions<T>,
  ): Promise<T | null> {
    filter ||= {};
    filter._id = this.assureEntityId(identity);
    return this.findOne(filter, options);
  }

  /**
   * Finds multiple entities by id.
   * Note that by default a `DEFAULT_FETCH_LIMIT` is used, which can be overwritten by option.
   * @param ids
   * @param options
   */
  async findAllByIds(ids: DocumentIdentity<T>[], options?: IFetchQueryOptions<T>): Promise<T[]> {
    return this.findAll({ _id: { $in: ids.map((id) => this.assureEntityId(id)) } }, options);
  }

  /**
   * Finds all entities by given filter.
   * Note that by default a `DEFAULT_FETCH_LIMIT` is used, which can be overwritten by option.
   * @param filter
   * @param options
   */
  async findAll(filter: FilterQuery<T>, options?: IFetchQueryOptions<T>): Promise<T[]> {
    options ??= {};

    const query = this.getModel(options).find(filter, options?.projection, options);
    const fetchFilter = this.getFetchQueryFilter(options);

    if (fetchFilter) {
      query.where(fetchFilter);
    }

    if (options?.collation) {
      query.collation(options.collation);
    }

    return this.constructModels(await this.applyFetchQueryOptions(query, options).lean());
  }

  /**
   * Assures that the given object is an entity-id an if possible transforms it to one.
   * @param identity
   * @protected
   */
  protected assureEntityId(identity: DocumentIdentity<T>): T['_id'] {
    return assureObjectId(identity);
  }

  /**
   * Finds the first entity which matches the given filter.
   * @param filter
   * @param options
   */
  async findOne<C = T>(
    filter: FilterQuery<C>,
    options?: IBaseFetchQueryOptions<T>,
  ): Promise<T | null> {
    const query = this.getModel(options).findOne(filter, options?.projection, options);

    if (options?.collation) {
      query.collation(options.collation);
    }

    const model = await query.lean();
    return model ? this.constructModel(model) : null;
  }

  /**
   * Upserts all documents matching the given filter.
   * @param filter
   * @param update
   * @param options
   */
  async upsert(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: IUpsertQueryOptions = {},
  ): Promise<T | null> {
    options.new ??= true;
    const query = this.getModel(options).findOneAndUpdate(filter, update, {
      upsert: true,
      ...options,
    });

    if (options?.collation) {
      query.collation(options.collation);
    }

    const model = await query.lean();
    return model ? this.constructModel(model) : null;
  }

  /**
   * Applies some default filters to the query based on the given options.
   * @param options
   * @protected
   */
  protected getFetchQueryFilter(options: IFetchQueryFilterOptions<T>): FilterQuery<any> | null {
    const { excludeIds } = options;

    if (!excludeIds) return null;

    return {
      _id: Array.isArray(excludeIds)
        ? { $nin: excludeIds.map((identity) => this.assureEntityId(identity)) }
        : { $ne: this.assureEntityId(excludeIds) },
    };
  }

  /**
   * Applies default query settings based on the given options.
   * @param query
   * @param options
   * @protected
   */
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

  /**
   * Finds a document by id and sets the given updateSet data which automatically translates into a `{ $set: updateSet }` update.
   * @param id
   * @param updateSet
   * @param options
   */
  async findOneAndSetById(
    id: DocumentIdentity<T>,
    updateSet: UpdateQuerySet<T>,
    options?: IFindAndUpdateQueryOptions<T>,
  ): Promise<T | null> {
    return this.findOneAndUpdateById(id, { $set: updateSet }, options);
  }

  /**
   * Finds a document by id and applies the given update.
   * @param id
   * @param update
   * @param options
   */
  async findOneAndUpdateById(
    id: DocumentIdentity<T>,
    update: UpdateQuery<T>,
    options?: IFindAndUpdateQueryOptions<T>,
  ): Promise<T | null> {
    return this.findOneAndUpdateByFilter(id, update, {}, options);
  }

  /**
   * Finds the first document which matches the given filters and sets the given updateSet data which automatically
   * translates into a `{ $set: updateSet }` update.
   * @param id
   * @param update
   * @param filter
   * @param options
   */
  async findOneAndUpdateSetByFilter(
    id: DocumentIdentity<T>,
    update: UpdateQuerySet<T>,
    filter?: FilterQuery<T>,
    options?: IFindAndUpdateQueryOptions<T>,
  ): Promise<T | null> {
    return this.findOneAndUpdateByFilter(id, { $set: update }, filter, options);
  }

  /**
   * Finds the first document which matches the given filters and applies the given update.
   * @param id
   * @param update
   * @param filter
   * @param options
   */
  async findOneAndUpdateByFilter(
    id: DocumentIdentity<T>,
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

    const query = this.getModel(options).findOneAndUpdate(filter, cloneDeep(update), options);

    if (options?.collation) {
      query.collation(options.collation);
    }

    const result = await query.lean();

    if (!result) return null;

    if (!options || options.apply !== false) {
      applyUpdateTo(id, update);
    }

    return this.constructModel(result);
  }

  /**
   * Updates one document by given id and sets the given updateSet data which automatically
   * translates into a `{ $set: updateSet }` update.
   * @param id
   * @param updateSet
   * @param options
   */
  async updateOneSetById(
    id: DocumentIdentity<T>,
    updateSet: UpdateQuerySet<T>,
    options?: IBaseQueryOptions,
  ) {
    return this.updateOneById(id, { $set: updateSet }, options);
  }

  /**
   * Updates one document by given id and unsets the given updateUnset data which automatically
   * translates into a `{ $unset: updateUnset }` update.
   * @param id
   * @param updateUnset
   * @param options
   */
  async updateOneUnsetById(
    id: DocumentIdentity<T>,
    updateUnset: UpdateQueryUnset<T>,
    options?: IBaseQueryOptions,
  ) {
    return this.updateOneById(id, { $unset: updateUnset }, options);
  }

  /**
   * Updates one document by given id and applies the given update.
   * @param id
   * @param update
   * @param options
   */
  async updateOneById(
    id: DocumentIdentity<T>,
    update: UpdateQuery<T>,
    options?: IUpdateQueryOptions,
  ): Promise<boolean> {
    return this.updateOneByFilter(id, update, {}, options);
  }

  /**
   * Updates the first document which matches the given filter and applies the given update.
   * @param id
   * @param update
   * @param options
   */
  protected async updateOneByFilter(
    identity: DocumentIdentity<T>,
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

    if (options?.collation) {
      query.collation(options.collation);
    }

    const result = await query.exec();
    const { modifiedCount } = result;

    if (modifiedCount && (!options || options.apply !== false)) {
      /**
       * TODO: In case a pre or post hook changes the update, this will not be reflected, we could use query.getUpdate()
       * but the result contains NestedDocs which would overwrite our sub model types at the moment.
       */
      applyUpdateTo(identity, update);
    }

    return !!modifiedCount;
  }

  /**
   * This function will try to determine the actual discriminator model from the schema in case the options discriminator property is set.
   * @param options
   * @protected
   */
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

  /**
   * This function may be overwritten by subclasses to intercept model updates before they are send to the database.
   * @param id
   * @param update
   * @protected
   */
  protected async beforeUpdate(
    id: DocumentIdentity<T>,
    update: UpdateQuery<T>,
  ): Promise<PartialEntityData<T> | boolean> {
    return Promise.resolve(true);
  }

  /**
   * Updates the given set data by bulkWrite.
   * @param updates
   * @param options
   */
  async updateSetBulk(
    updates: { id: DocumentIdentity<T>; update: UpdateQuerySet<T> }[],
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

  /**
   * Reloads a given entity by id or instance.
   * @param id
   */
  async reload(id: DocumentIdentity<T>): Promise<T | null> {
    return this.findById(id);
  }

  /**
   * Deletes many documents by id.
   * @param ids
   * @param options
   */
  async deleteManyByIds(ids: DocumentIdentity<T>[], options?: DeleteOptions): Promise<number> {
    return this.deleteMany({ _id: { $in: ids.map((id) => this.assureEntityId(id)) } }, options);
  }

  /**
   * Deletes many documents by filter.
   * @param filter
   * @param options
   */
  async deleteMany(filter: FilterQuery<T>, options?: DeleteOptions): Promise<number> {
    return (await this.getModel(options).deleteMany(filter, options)).deletedCount;
  }

  /**
   * Deletes the first document which matches the given filter.
   * @param filter
   * @param options
   */
  async deleteOne(filter: FilterQuery<T>, options?: DeleteOptions): Promise<boolean> {
    return (await this.getModel(options).deleteOne(filter, options)).deletedCount === 1;
  }
}
