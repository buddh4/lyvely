import {
  applyUpdateTo,
  assureObjectId,
  assureStringId,
  createBaseDocumentInstance,
  DocumentIdentity,
  EntityData,
} from '../utils';
import {
  ClientSession,
  FilterQuery,
  HydratedDocument,
  Model,
  MongooseBaseQueryOptions,
  MongooseBulkWriteOptions,
  MongooseUpdateQueryOptions,
  PipelineStage,
  ProjectionType,
  QueryWithHelpers,
  UpdateQuery,
} from 'mongoose';
import type { BaseDocument, LeanDoc, TObjectId } from '../interfaces';
import {
  BulkWriteResult,
  CollationOptions,
  DeleteOptions as MongoDeleteOptions,
  UpdateOptions as MongoUpdateOptions,
} from 'mongodb';
import { Inject, Logger } from '@nestjs/common';
import { ModelSaveEvent } from './dao.events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  cloneDeep,
  getPrototypeTree,
  isNil,
  isValidObjectId,
  PropertiesOf,
  Type,
} from '@lyvely/common';
import type { IDocumentTransformation } from './document.transformation';
import type { IDocumentTransformer } from './document.transformer';
import { DocumentTransformer } from './document.transformer';
import { type IDaoMetadata } from './dao.decorator';
import { AbstractTypeRegistry } from '@/core/components';
import { META_DAO } from '@/core/db/db.constants';
import { IntegrityException } from '@lyvely/interface';
import {
  TenancyException,
  TenancyIsolation,
  TenancyService,
  type TenancyStore,
} from '@/core/tenancy';
import { ClsService } from 'nestjs-cls';

interface IPagination {
  page: number;
  limit: number;
}
type ContainsDot = `${string}.${string}`;

export type UpdateQuerySet<T extends BaseDocument> = UpdateQuery<T>['$set'];
export type UpdateQueryUnset<T extends BaseDocument> = UpdateQuery<T>['$unset'];

type SortableRecord<T extends BaseDocument> = Partial<Omit<T, '__v' | 'id'>> & {
  [key: ContainsDot]: any;
};

export type QuerySort<T extends BaseDocument> = {
  [P in keyof SortableRecord<T>]: 1 | -1 | 'asc' | 'desc';
};

type EntityQuery<T extends BaseDocument> = QueryWithHelpers<
  // eslint-disable-next-line @typescript-eslint/ban-types
  Array<HydratedDocument<T, any, any>>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  HydratedDocument<T, any, any>,
  any,
  T
>;

export interface IBaseQueryOptions {
  session?: ClientSession | null;
  tenancyId?: string | TObjectId;
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

export interface IBaseFetchQueryOptions<T extends BaseDocument> extends IBaseQueryOptions {
  projection?: ProjectionType<T>;
  sort?: QuerySort<T>;
  collation?: CollationOptions;
}

export interface IFindAndUpdateQueryOptions<T extends BaseDocument>
  extends IBaseFetchQueryOptions<T>,
    IUpdateQueryOptions {
  new?: boolean;
  upsert?: boolean;
  raw?: boolean;
}

export type SaveOptions = IBaseQueryOptions;

export interface IFetchQueryFilterOptions<T extends BaseDocument>
  extends IBaseFetchQueryOptions<T> {
  excludeIds?: DocumentIdentity<T>[] | DocumentIdentity<T>;
}

export interface IFetchQueryOptions<T extends BaseDocument> extends IFetchQueryFilterOptions<T> {
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

export type UpdateOptions<T = unknown> = IUpdateQueryOptions &
  MongoUpdateOptions &
  MongooseUpdateQueryOptions<T>;
export type DeleteOptions<T = unknown> = IBaseQueryOptions &
  MongoDeleteOptions &
  MongooseBaseQueryOptions<T>;

export type PartialEntityData<T extends BaseDocument> = Partial<EntityData<T>>;

/**
 * Abstract Data Access Object provides basic data access features for subclasses.
 * This class will hardly use the mongoose Model API but instead mainly utilizes the mongoose Query API, which means
 * we hardly interact with mongoose Models and mainly facilitate the `lean` function and do partial document updates like `$set`
 * manually. This class provides many helper functions to support writing fetch and update queries.
 * The advantage of this is that you can directly work with your model class instances and enables a better abstraction
 * by only using mongoose for data access and schema validation.
 *
 * Subclasses may extend this feature for complex queries or updates of a certain model.
 *
 * @example
 *
 * @Dao(MyModel)
 * class MyModelDao extends AbstractDao<MyModel> {}
 */
export abstract class AbstractDao<
  T extends BaseDocument,
  TVersions extends BaseDocument = T,
  TMeta extends IDaoMetadata<T> = IDaoMetadata<T>,
  TDoc = T & Document,
> {
  @Inject()
  private tenancyService: TenancyService;

  @Inject()
  private readonly clsService: ClsService<TenancyStore>;

  /**
   * Represents the mongoose model containing the main db connection.
   * This model instance should not be called directly, use the `getModel()` function instead, which
   * handles multi-tenancy and other model/connection issues.
   *
   * @class
   * @template T - The type of data to be stored in the model.
   */
  private model: Model<T>;

  /**
   * Logger for logging error and debug information.
   * @protected
   */
  protected logger: Logger;

  /**
   * The discriminator key used for distinguishing between different types or subtypes.
   *
   * If this value is undefined, the discriminator is unknown yet, if it is null there is no
   * discriminator key otherwise the discriminator key is known.
   *
   * @typedef {string|null|undefined} DiscriminatorKey
   */
  private discriminatorKey?: string | null;

  /**
   * Represents the metadata associated with a DAO (Data Access Object) class.
   *
   * @template T - The type of the data objects managed by the DAO.
   */
  private metaData?: TMeta;

  /**
   * Can be used as alternative to discriminator metadata definition.
   *
   * @template T - The type of items stored in the registry.
   */
  protected typeRegistry?: AbstractTypeRegistry<T>;

  /**
   * Document transformation registry for the given document type.
   *
   * @template T - The type of documents being transformed.
   * @param {Array<IDocumentTransformation<T>>} transformations - An array of document transformations.
   * @returns {void}
   */
  protected transformer: IDocumentTransformer<T, TVersions> = new DocumentTransformer<
    T,
    TVersions
  >();

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
  protected getModelConstructor(leanModel: LeanDoc<T>): Type<T> {
    const meta = this.getMetaData();
    const type = meta.type;
    const discriminator = meta.discriminator || this.typeRegistry;

    // No meta discriminator and type registry defined, so we can just return the base type.
    if (!discriminator) return type;

    // A custom discriminator function is defined.
    if (typeof discriminator === 'function') return discriminator(leanModel) || type;

    // Try to determine the discriminator type by discriminator key and value
    const discriminatorKey = this.getDiscriminatorKey();

    if (!discriminatorKey || !(discriminatorKey in leanModel)) return type;

    const discriminatorValue: string = (leanModel as Partial<T>)[discriminatorKey] as string;

    if (discriminator instanceof AbstractTypeRegistry) {
      return discriminator.getTypeConstructor(discriminatorValue, type);
    }

    // Both is given a discriminator meta setting and type registry, but we still have no result.
    if (meta.discriminator && this.typeRegistry) {
      return this.typeRegistry.getTypeConstructor(discriminatorValue, type);
    }

    return discriminator[discriminatorValue] || type;
  }

  /**
   * Retrieves the discriminator key for the current model.
   *
   * @private
   * @returns {string | null} The discriminator key.
   */
  private getDiscriminatorKey(): string | null {
    if (this.discriminatorKey || this.discriminatorKey === null) return this.discriminatorKey;
    const discriminators = this.model.schema.discriminators;
    if (isNil(discriminators)) {
      return (this.discriminatorKey = null);
    }

    if ('discriminatorMapping' in this.model.schema) {
      this.discriminatorKey = (this.model.schema.discriminatorMapping as { key: string }).key;
    }

    if (this.discriminatorKey) return this.discriminatorKey;

    for (const schema of Object.values(discriminators)) {
      const options = ('options' in schema ? schema.options : undefined) as
        | {
            discriminatorKey?: string;
          }
        | undefined;
      if (options) {
        this.discriminatorKey = options.discriminatorKey || null;
        return this.discriminatorKey;
      }
    }

    return (this.discriminatorKey = null);
  }

  /**
   * Retrieves the metadata for the current instance or its prototype chain.
   *
   * @protected
   * @return {TMeta} The metadata object.
   * @throws {IntegrityException} if no dao metadata is set.
   */
  protected getMetaData(): TMeta {
    if (this.metaData) return this.metaData;
    this.metaData = Reflect.getMetadata(META_DAO, this.constructor);

    if (this.metaData) return this.metaData;

    for (const prototype of getPrototypeTree(this.constructor as Type)) {
      this.metaData = Reflect.getMetadata(META_DAO, prototype);
      if (this.metaData) return this.metaData;
    }

    if (this.metaData) return this.metaData;

    throw new IntegrityException(`No dao metadata set ${this.constructor.name}`);
  }

  /**
   * Registers document transformations.
   *
   * @param {...IDocumentTransformation<TVersions>[]} transformations - An array of document transformations to register.
   */
  registerTransformations(...transformations: IDocumentTransformation<TVersions>[]) {
    this.transformer.registerTransformations(...transformations);
  }

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
    return this.model.modelName;
  }

  /**
   * Passes the given lean document through all available transformations and updates the whole document if at least
   * one transformation was applied.
   * @protected
   * @param leanDoc
   */
  protected async transformOne(leanDoc: LeanDoc<TVersions> | null): Promise<LeanDoc<T> | null> {
    if (!leanDoc) return null;
    const [transformedDoc] = await this._transformDocument(leanDoc, true);
    return transformedDoc;
  }

  /**
   * Passes the given lean document through all available transformations and updates the whole document if at least
   * one transformation was applied.
   * @protected
   * @param leanDocs
   */
  protected async transformAll(leanDocs: LeanDoc<TVersions>[]): Promise<LeanDoc<T>[]> {
    const updates: Array<{ id: DocumentIdentity<T>; update: LeanDoc<T> }> = [];
    const result: LeanDoc<T>[] = [];
    for (const leanDoc of leanDocs) {
      const [transformResult, wasTransformed] = await this._transformDocument(leanDoc, false);
      if (wasTransformed)
        updates.push({ id: transformResult._id as T['_id'], update: transformResult });
      result.push(transformResult);
    }

    await this.updateBulk(updates);
    return result;
  }

  /**
   * Passes the given lean document through all available transformations and updates the whole document if the update
   * argument is set to true and at least one transformation was applied.
   * @param lean
   * @param update
   * @protected
   */
  private async _transformDocument(
    lean: LeanDoc<TVersions>,
    update: boolean
  ): Promise<[LeanDoc<T>, boolean]> {
    const [result, wasTransformed] = this.transformer.transformDocument(lean);

    if (update && wasTransformed) {
      await this.updateOneById(result._id as T['_id'], result);
    }

    return [(<unknown>result) as LeanDoc<T>, wasTransformed];
  }

  /**
   * This function is used to create model instances from lean objects by facilitating the `getModelConstructor` function.
   * This function may be overwritten by subclasses in rare cases where the `getModelConstructor` is not sufficient e.g.
   * in cases we need to create the model by a factory.
   * @param lean
   * @protected
   */
  protected constructModel(lean: LeanDoc<T>): T {
    return createBaseDocumentInstance(this.getModelConstructor(lean), lean);
  }

  /**
   * This function is used to create multiple model instances from lean objects by facilitating the `constructModel` function
   * and is usually called by fetch queries.
   * @protected
   * @param leanArr
   */
  protected constructModels(leanArr: LeanDoc<T>[]): T[] {
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
    const leanDoc = (await new entityModel(entityData).save(options)).toObject<PropertiesOf<T>>({
      virtuals: true,
      aliases: true,
      getters: true,
    });
    const model = this.constructModel(leanDoc);
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
    options?: IBaseFetchQueryOptions<T>
  ): Promise<T | null> {
    const query = this.getModel(options).findById<PropertiesOf<TVersions>>(
      this.assureDocumentId(identity),
      options?.projection,
      options
    );

    if (options?.collation) {
      query.collation(options.collation);
    }

    const leanDoc = <LeanDoc<TVersions> | null>await query.lean().exec();
    return this.transformAndConstructModel(leanDoc);
  }

  /**
   * Transforms and constructs a model instance based on the given lean document.
   *
   * @param {LeanDoc<TVersions>} leanDoc - The lean document to transform and construct the model from.
   * @returns {Promise<TModel | null>} A promise that resolves to the transformed and constructed model, or null if the transformation did not result in a valid model.
   */
  async transformAndConstructModel(leanDoc: LeanDoc<TVersions> | null): Promise<T | null> {
    const transformed = await this.transformOne(leanDoc);
    return transformed ? this.constructModel(transformed) : null;
  }

  /**
   * Transforms and constructs multiple model instances.
   *
   * @param {LeanDoc<TVersions>[]} leanDocs - The array of LeanDoc objects.
   * @returns {Promise<SomeModel[]>} The array of constructed models.
   */
  async transformAndConstructModels(leanDocs: LeanDoc<TVersions>[]): Promise<T[]> {
    const transformed = await this.transformAll(leanDocs);
    return this.constructModels(transformed);
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
    options?: IBaseFetchQueryOptions<T>
  ): Promise<T | null> {
    filter ||= {};
    filter._id = this.assureDocumentId(identity);
    return this.findOne(filter, options);
  }

  /**
   * Finds multiple entities by id.
   * Note that by default a `DEFAULT_FETCH_LIMIT` is used, which can be overwritten by option.
   * @param ids
   * @param options
   */
  async findAllByIds(ids: DocumentIdentity<T>[], options?: IFetchQueryOptions<T>): Promise<T[]> {
    return this.findAll({ _id: { $in: ids.map((id) => this.assureDocumentId(id)) } }, options);
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

    return this.transformAndConstructModels(
      await this.applyFetchQueryOptions(query, options).lean()
    );
  }

  /**
   * Assures that the given object is an entity-id an if possible transforms it to one.
   * @param identity
   * @protected
   */
  protected assureDocumentId(identity: DocumentIdentity<T>): T['_id'] {
    return assureObjectId(identity);
  }

  /**
   * Finds the first entity which matches the given filter.
   * @param filter
   * @param options
   */
  async findOne<C = T>(
    filter: FilterQuery<C>,
    options?: IBaseFetchQueryOptions<T>
  ): Promise<T | null> {
    const query = this.getModel(options).findOne(filter, options?.projection, options);

    if (options?.collation) {
      query.collation(options.collation);
    }

    const model = <LeanDoc<TVersions> | null>await query.lean();
    return this.transformAndConstructModel(model);
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
    options: IUpsertQueryOptions = {}
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
        ? { $nin: excludeIds.map((identity) => this.assureDocumentId(identity)) }
        : { $ne: this.assureDocumentId(excludeIds) },
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
    options: IFetchQueryOptions<T>
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
    options?: IFindAndUpdateQueryOptions<T>
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
    options?: IFindAndUpdateQueryOptions<T>
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
    options?: IFindAndUpdateQueryOptions<T>
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
    options?: IFindAndUpdateQueryOptions<T>
  ): Promise<T | null> {
    if (!(await this.beforeUpdate(id, update))) return null;

    options = options || {};
    if (typeof options.new === 'undefined') {
      options.new = true;
    }

    filter = filter || {};
    filter._id = this.assureDocumentId(id);

    const query = this.getModel(options).findOneAndUpdate(filter, cloneDeep(update), options);

    if (options?.collation) {
      query.collation(options.collation);
    }

    const result = <LeanDoc<TVersions> | null>await query.lean();

    if (!result) return null;

    if (!options || options.apply !== false) {
      applyUpdateTo(id, update);
    }

    return this.transformAndConstructModel(result);
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
    options?: UpdateOptions<TDoc>
  ): Promise<boolean> {
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
    options?: UpdateOptions<TDoc>
  ): Promise<boolean> {
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
    options?: UpdateOptions<TDoc>
  ): Promise<boolean> {
    return this.updateOneByFilter(id, update, {}, options);
  }

  /**
   * Updates the first document which matches the given filter and applies the given update.
   * @param identity
   * @param update
   * @param filter
   * @param options
   */
  protected async updateOneByFilter(
    identity: DocumentIdentity<T>,
    update: UpdateQuery<T>,
    filter?: FilterQuery<T>,
    options?: UpdateOptions<T>
  ): Promise<boolean> {
    // TODO: trigger events
    const clonedUpdate = cloneDeep(update);

    if (!(await this.beforeUpdate(identity, clonedUpdate))) return false;

    filter = filter || {};
    filter._id = this.assureDocumentId(identity);

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
  protected getModel(options?: IBaseQueryOptions | null): Model<T> {
    let model = this.getTenantModel(options);

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
   * Retrieves the tenant db model depending on the configured tenancy isolation.
   *
   * @private
   * @returns {Model<T>} The database model for this instance.
   * @throws {IntegrityException} If the tenant cannot be identified or is invalid.
   */
  private getTenantModel(options: IBaseQueryOptions | undefined | null): Model<T> {
    const isolationLevel = this.tenancyService.getTenancyIsolation();
    const daoIsolation = this.getMetaData().isolation ?? TenancyIsolation.Profile;

    if (isolationLevel === TenancyIsolation.None || daoIsolation === TenancyIsolation.None) {
      return this.model;
    }

    // In case of profile isolation, we do not isolate documents with only strict isolation.
    if (isolationLevel === TenancyIsolation.Profile && daoIsolation === TenancyIsolation.Strict) {
      return this.model;
    }

    const tenancyId = this.getTenancyId(options);

    if (isNil(tenancyId)) throw new TenancyException('Could not identify tenant.');
    if (!isValidObjectId(tenancyId)) {
      throw new TenancyException(`Invalid tenant with oid. ${tenancyId}`);
    }

    if (!this.tenancyService.isIsolatedTenant(tenancyId)) return this.model;

    const db = this.model.db.useDb(this.tenancyService.getTenancyDb(tenancyId), {
      useCache: true,
      noListener: true,
    });

    if (!db.models[this.model.modelName]) {
      db.model<T>(this.model.modelName, this.model.schema);
    }

    return db.model<T>(this.model.modelName);
  }

  /**
   * Tries to retrieve the tenancy ID from the option or context.
   * @private
   * @returns {string | undefined} The tenancy ID if available, otherwise undefined.
   */
  private getTenancyId(options?: IBaseQueryOptions | null): string | undefined {
    return assureStringId(options?.tenancyId ?? this.clsService.get('oid'), true);
  }

  /**
   * This function may be overwritten by subclasses to intercept model updates before they are send to the database.
   * @param id
   * @param update
   * @protected
   */
  protected async beforeUpdate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: DocumentIdentity<T>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update: UpdateQuery<T>
  ): Promise<PartialEntityData<T> | boolean> {
    return Promise.resolve(true);
  }

  /**
   * Updates the given set data by bulkWrite.
   * @param updates
   * @param options
   */
  async updateBulk(
    updates: { id: DocumentIdentity<T>; update: UpdateQuery<T> }[],
    options?: MongooseBulkWriteOptions & IBaseQueryOptions
  ): Promise<Pick<BulkWriteResult, 'modifiedCount'>> {
    if (!updates.length) return { modifiedCount: 0 };
    const { modifiedCount } = await this.getModel(options).bulkWrite(
      updates.map((update) => ({
        updateOne: {
          filter: <any>{ _id: this.assureDocumentId(update.id) },
          update: <any>update.update,
        },
      })),
      options
    );

    return { modifiedCount };
  }

  /**
   * Updates the given set data by bulkWrite.
   * @param updates
   * @param options
   */
  async updateSetBulk(
    updates: { id: DocumentIdentity<T>; update: UpdateQuerySet<T> }[],
    options?: MongooseBulkWriteOptions & IBaseQueryOptions
  ): Promise<Pick<BulkWriteResult, 'modifiedCount'>> {
    if (!updates.length) return { modifiedCount: 0 };
    const { modifiedCount } = await this.getModel(options).bulkWrite(
      updates.map(({ id, update }) => ({
        updateOne: {
          filter: <any>{ _id: this.assureDocumentId(id) },
          update: <any>{ $set: update },
        },
      })),
      options
    );

    return { modifiedCount };
  }

  /**
   * Reloads a given entity by id or instance.
   * @param id
   * @param options
   */
  async reload(id: DocumentIdentity<T>, options?: IBaseQueryOptions): Promise<T | null> {
    return this.findById(id, options);
  }

  /**
   * Deletes many documents by id.
   * @param ids
   * @param options
   */
  async deleteManyByIds(ids: DocumentIdentity<T>[], options?: DeleteOptions): Promise<number> {
    return this.deleteMany({ _id: { $in: ids.map((id) => this.assureDocumentId(id)) } }, options);
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

  /**
   * Deletes a document by identity.
   * @param id
   * @param options
   */
  async deleteById(id: DocumentIdentity<T>, options?: DeleteOptions): Promise<boolean> {
    return (
      (await this.getModel(options).deleteOne({ _id: assureObjectId(id) }, options))
        .deletedCount === 1
    );
  }

  /**
   * Runs an aggregation pipeline on this model.
   * @param pipeline
   */
  async aggregate<T = any>(pipeline: PipelineStage[]): Promise<T[]> {
    return this.model.aggregate(pipeline).exec();
  }
}
