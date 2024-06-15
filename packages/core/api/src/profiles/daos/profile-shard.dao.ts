import {
  AbstractDao,
  IBaseFetchQueryOptions,
  DeleteOptions,
  IFetchQueryOptions,
  IFindAndUpdateQueryOptions,
  UpdateQuerySet,
  assureObjectId,
  DocumentIdentity,
  IBulkBaseQueryOptions,
  TObjectId,
  FilterQuery,
  UpdateQuery,
  BaseDocument,
  UpdateOptions,
} from '@/core';
import { ProfileShard, Profile } from '../schemas';

/**
 * This type is used as compound type for different kinds of profile relation on DAO level.
 * The ProfileShardDao at least requires an oid and pid for most of its queries.
 */
export type ProfileShardData =
  | Profile
  | ProfileShard
  | { oid: TObjectId; region: string; pid: TObjectId };

/**
 * This Dao class serves as base class for profile related models.
 * Profile related models need to include an oid and pid field which should be used in all queries.
 * Collections of this type share similar access pattern and may contain similar indexes or shard strategies.
 */
export abstract class ProfileShardDao<
  T extends ProfileShard,
  TVersions extends BaseDocument = T,
> extends AbstractDao<T, TVersions> {
  /**
   * Find a document by profile and document identity.
   *
   * @param {ProfileShardData} profile - The profile relation.
   * @param {DocumentIdentity<T>} identity - The document identity.
   * @param {IBaseFetchQueryOptions<T>} options - Optional query options.
   *
   * @returns {Promise<T|null>} - The found document, or null if not found.
   */
  async findByProfileAndId(
    profile: ProfileShardData,
    identity: DocumentIdentity<T>,
    options?: IBaseFetchQueryOptions<T>
  ) {
    return this.findOne(
      applyShardQueryFilter(profile, {
        _id: this.assureDocumentId(identity),
      }),
      options
    );
  }

  /**
   * Finds all documents matching the provided profile and document IDs.
   *
   * @param {ProfileShardData} profile - The profile to filter the documents.
   * @param {DocumentIdentity<T>[]} ids - The array of document IDs.
   * @param {IFetchQueryOptions<T>} [options] - Additional options for the fetch query.
   *
   * @return {Promise<T[]>} - A promise that resolves with an array of documents matching the profile relation and IDs.
   */
  async findAllByProfileAndIds(
    profile: ProfileShardData,
    ids: DocumentIdentity<T>[],
    options?: IFetchQueryOptions<T>
  ) {
    return this.findAllByProfile(
      profile,
      { _id: { $in: ids.map((id) => this.assureDocumentId(id)) } },
      options
    );
  }

  /**
   * Finds all records associated with a given profile.
   *
   * @param {ProfileShardData} profile - The profile to filter by.
   * @param {FilterQuery<C>} [filter] - Optional filter to apply on the records.
   * @param {IFetchQueryOptions<T>} [options] - Optional options for fetching the records.
   *
   * @returns {Promise<T[]>} - A promise that resolves to an array of records matching the given profile relation and filter.
   */
  async findAllByProfile<C = T>(
    profile: ProfileShardData,
    filter?: FilterQuery<C>,
    options?: IFetchQueryOptions<T>
  ): Promise<T[]> {
    return this.findAll(applyShardQueryFilter(profile, filter), options);
  }

  /**
   * Finds a single document in the collection that matches the specified profile and filter.
   *
   * @param {ProfileShardData} profile - The profile to apply to the query filter.
   * @param {FilterQuery<C>} filter - The query filter to apply.
   * @param {IBaseFetchQueryOptions<T>} [options] - The optional query options.
   *
   * @returns {Promise<T | null>} - A promise that resolves with the found document, or null if no document is found.
   */
  async findOneByProfile<C = T>(
    profile: ProfileShardData,
    filter: FilterQuery<C>,
    options?: IBaseFetchQueryOptions<T>
  ): Promise<T | null> {
    return this.findOne(applyShardQueryFilter(profile, filter), options);
  }

  /**
   * Updates a single document matching the given profile and id, using the provided update set and options.
   *
   * @param {ProfileShardData} profile - The profile object.
   * @param {DocumentIdentity<T>} id - The document id.
   * @param {UpdateQuerySet<T>} updateSet - The set of update queries.
   * @param {UpdateOptions<T>} [options] - The options for the update operation.
   *
   * @returns {Promise<any>} - A promise that resolves when the update operation is complete.
   */
  async updateOneByProfileAndIdSet(
    profile: ProfileShardData,
    id: DocumentIdentity<T>,
    updateSet: UpdateQuerySet<T>,
    options?: UpdateOptions<T>
  ) {
    return this.updateOneByProfileAndId(profile, id, { $set: <any>updateSet }, options);
  }

  /**
   * Updates a single document in the database based on the profile and ID.
   *
   * @param {ProfileShardData} profile - The profile.
   * @param {DocumentIdentity<T>} id - The ID of the document to update.
   * @param {UpdateQuery<T>} update - The update operation to apply to the document.
   * @param {UpdateOptions<T>} [options] - The additional update options (optional).
   * @returns {Promise<Query<T | null>>} - A promise that resolves to the updated document or null if no document was found.
   */
  async updateOneByProfileAndId(
    profile: ProfileShardData,
    id: DocumentIdentity<T>,
    update: UpdateQuery<T>,
    options?: UpdateOptions<T>
  ) {
    return this.updateOneByFilter(id, update, applyShardQueryFilter(profile), options);
  }

  /**
   * Updates a single document in the database based on the given profile and filter.
   *
   * @param {ProfileShardData} profile - The profile shard data.
   * @param {DocumentIdentity<T>} identity - The document identity.
   * @param {UpdateQuery<T>} update - The update query.
   * @param {FilterQuery<T>} [filter] - The filter query.
   * @param {UpdateOptions<T>} [options] - The update options.
   * @returns {Promise<boolean>} - A boolean indicating whether the update was successful.
   * @protected
   */
  protected async updateOneByProfileAndFilter(
    profile: ProfileShardData,
    identity: DocumentIdentity<T>,
    update: UpdateQuery<T>,
    filter?: FilterQuery<T>,
    options?: UpdateOptions<T>
  ): Promise<boolean> {
    return this.updateOneByFilter(
      identity,
      update,
      applyShardQueryFilter(profile, filter),
      options
    );
  }

  /**
   * Finds a document by profile and id, and sets the specified fields with the given values.
   *
   * @param {ProfileShardData} profile - The profile shard data to filter the document by.
   * @param {DocumentIdentity<T>} id - The unique identifier of the document.
   * @param {UpdateQuerySet<T>} updateSet - The fields and values to be set in the document. Should be of type T.
   * @param {IFindAndUpdateQueryOptions<T>} [options] - Optional find and update query options.
   * @return {Promise<T | null>} A promise that resolves to the updated document, or null if no document is found.
   */
  async findOneAndSetByProfileAndId(
    profile: ProfileShardData,
    id: DocumentIdentity<T>,
    updateSet: UpdateQuerySet<T>,
    options?: IFindAndUpdateQueryOptions<T>
  ): Promise<T | null> {
    return this.findOneAndUpdateByProfileAndId(profile, id, { $set: <any>updateSet }, options);
  }

  /**
   * Finds one document using a profile and id, and updates it according to the provided update query and options.
   *
   * @param {ProfileShardData} profile - The profile used to apply shard query filter.
   * @param {DocumentIdentity<T>} id - The document id.
   * @param {UpdateQuery<T>} update - The update query.
   * @param {IFindAndUpdateQueryOptions<T>} [options] - The options to configure the query.
   * @returns {Promise<T | null>} - A Promise that resolves to the updated document or null.
   */
  async findOneAndUpdateByProfileAndId(
    profile: ProfileShardData,
    id: DocumentIdentity<T>,
    update: UpdateQuery<T>,
    options?: IFindAndUpdateQueryOptions<T>
  ): Promise<T | null> {
    return this.findOneAndUpdateByFilter(id, update, applyShardQueryFilter(profile), options);
  }

  /**
   * Finds a document by combining the profile and filter and updates it.
   *
   * @param {ProfileShardData} profile - The profile to use for applying the shard query filter.
   * @param {DocumentIdentity<T>} id - The identifier of the document to update.
   * @param {UpdateQuery<T>} update - The update query to apply to the document.
   * @param {FilterQuery<T>} [filter] - The filter query to combine with the profile to find the document. (optional)
   * @param {IFindAndUpdateQueryOptions<T>} [options] - The options to use for the findOneAndUpdate operation. (optional)
   * @returns {Promise<T | null>} - A promise that resolves to the updated document or null if no document matches the filter.
   */
  async findOneAndUpdateByProfileAndFilter(
    profile: ProfileShardData,
    id: DocumentIdentity<T>,
    update: UpdateQuery<T>,
    filter?: FilterQuery<T>,
    options?: IFindAndUpdateQueryOptions<T>
  ): Promise<T | null> {
    return this.findOneAndUpdateByFilter(
      id,
      update,
      applyShardQueryFilter(profile, filter),
      options
    );
  }

  /**
   * Update multiple documents in bulk, based on the provided profile.
   *
   * @param {ProfileShardData} profile - The profile used for filtering the documents to be updated.
   * @param {Array<{ id: DocumentIdentity<T>, update: UpdateQuerySet<T> }>} updates - An array of objects containing the document ID and update query for each document.
   * @param {IBulkBaseQueryOptions} options - Options for the bulk update operation.
   * @returns {Promise<void>} - A Promise that resolves when the bulk update operation is completed.
   */
  async updateSetBulkByProfile(
    profile: ProfileShardData,
    updates: { id: DocumentIdentity<T>; update: UpdateQuerySet<T> }[],
    options?: IBulkBaseQueryOptions
  ) {
    await this.getModel(options).bulkWrite(
      updates.map((update) => ({
        updateOne: <any>{
          filter: applyShardQueryFilter(profile, {
            _id: this.assureDocumentId(update.id),
          }),
          update: { $set: update.update },
        },
      })),
      options
    );
  }

  /**
   * Deletes all documents in the database by profile.
   *
   * @param {ProfileShardData} profile - The profile data to be used for filtering the documents.
   * @param {DeleteOptions} [options] - Additional options for the delete operation.
   * @returns {Promise<number>} The number of documents deleted.
   */
  async deleteAllByProfile(profile: ProfileShardData, options?: DeleteOptions): Promise<number> {
    return this.deleteMany(applyShardQueryFilter(profile), options);
  }

  /**
   * Deletes multiple documents in the database that match the given profile and filter.
   *
   * @param {ProfileShardData} profile - The profile associated with the documents.
   * @param {FilterQuery<T>} filter - The filter to apply when deleting documents.
   * @param {DeleteOptions} [options] - Additional options for the delete operation.
   * @returns {Promise<number>} - A Promise that resolves to the number of deleted documents.
   */
  async deleteManyByProfile(
    profile: ProfileShardData,
    filter: FilterQuery<T>,
    options?: DeleteOptions
  ): Promise<number> {
    return this.deleteMany(applyShardQueryFilter(profile, filter), options);
  }

  /**
   * Deletes one document from the collection based on the given profile and filter.
   *
   * @param {ProfileShardData} profile - The profile shard data.
   * @param {FilterQuery<T>} filter - The filter to match the document to be deleted.
   * @param {DeleteOptions} [options] - The options to pass to the delete operation.
   * @returns {Promise<boolean>} - A promise that resolves to true if the document was successfully deleted, otherwise false.
   */
  async deleteOneByProfile(
    profile: ProfileShardData,
    filter: FilterQuery<T>,
    options?: DeleteOptions
  ): Promise<boolean> {
    return this.deleteOne(applyShardQueryFilter(profile, filter), options);
  }
}

/**
 * Applies the shard query filter to a profile.
 *
 * @param {ProfileShardData} profile - The profile data.
 * @param {FilterQuery<any>} [filter] - The filter query to apply (optional).
 * @returns {FilterQuery<any>} - The updated filter query.
 */
function applyShardQueryFilter(profile: ProfileShardData, filter?: FilterQuery<any>) {
  filter = filter || {};
  if (profile.oid) {
    filter.oid = assureObjectId(profile.oid);
  } else {
    console.warn(new Error('Use of profile filter without given oid').stack);
  }
  filter.pid = assureProfileId(profile);
  return filter;
}

/**
 * Ensures that the provided profile object has a valid profile ID.
 *
 * @param {ProfileShardData} profile - The profile object to check.
 * @returns {Profile['_id']} - The valid profile ID.
 */
function assureProfileId(profile: ProfileShardData): Profile['_id'] {
  return profile instanceof Profile ? profile._id : (assureObjectId(profile.pid) as Profile['_id']);
}
