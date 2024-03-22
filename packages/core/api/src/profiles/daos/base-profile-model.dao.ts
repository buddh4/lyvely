import {
  AbstractDao,
  IBaseFetchQueryOptions,
  IBaseQueryOptions,
  DeleteOptions,
  IFetchQueryOptions,
  IFindAndUpdateQueryOptions,
  IUpdateQueryOptions,
  UpdateQuerySet,
  assureObjectId,
  DocumentIdentity,
  IBulkBaseQueryOptions,
  TObjectId,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from '@/core';
import { ProfileDocument } from '../daos';
import { Profile } from '../schemas';

/**
 * This type is used as compound type for different kinds of profile relation on DAO level.
 * The ProfileDocumentDao at least requires an oid and pid for most of its queries.
 */
export type ProfileShard =
  | Profile
  | ProfileDocument
  | { oid: TObjectId; location: string; pid: TObjectId };

/**
 * This Dao class serves as base class for profile related models.
 * Profile related models need to include an oid and pid field which should be used in all queries.
 */
export abstract class ProfileDocumentDao<T extends ProfileDocument> extends AbstractDao<T> {
  async findByProfileAndId(
    profileRelation: ProfileShard,
    identity: DocumentIdentity<T>,
    options?: IBaseFetchQueryOptions<T>,
  ) {
    return this.findOne(
      applyShardQueryFilter(profileRelation, {
        _id: this.assureDocumentId(identity),
      }),
      options,
    );
  }

  async findAllByProfileAndIds(
    profileRelation: ProfileShard,
    ids: DocumentIdentity<T>[],
    options?: IFetchQueryOptions<T>,
  ) {
    return this.findAllByProfile(
      profileRelation,
      { _id: { $in: ids.map((id) => this.assureDocumentId(id)) } },
      options,
    );
  }

  async findAllByProfile<C = T>(
    profileRelation: ProfileShard,
    filter?: FilterQuery<C>,
    options?: IFetchQueryOptions<T>,
  ): Promise<T[]> {
    return this.findAll(applyShardQueryFilter(profileRelation, filter), options);
  }

  async findOneByProfile<C = T>(
    profileRelation: ProfileShard,
    filter: FilterQuery<C>,
    options?: IBaseFetchQueryOptions<T>,
  ): Promise<T | null> {
    return this.findOne(applyShardQueryFilter(profileRelation, filter), options);
  }

  async updateOneByProfileAndIdSet(
    profileRelation: ProfileShard,
    id: DocumentIdentity<T>,
    updateSet: UpdateQuerySet<T>,
    options?: IBaseQueryOptions,
  ) {
    return this.updateOneByProfileAndId(profileRelation, id, { $set: <any>updateSet }, options);
  }

  async updateOneByProfileAndId(
    profileRelation: ProfileShard,
    id: DocumentIdentity<T>,
    update: UpdateQuery<T>,
    options?: IUpdateQueryOptions,
  ) {
    return this.updateOneByFilter(id, update, applyShardQueryFilter(profileRelation), options);
  }

  protected async updateOneByProfileAndFilter(
    profileRelation: ProfileShard,
    identity: DocumentIdentity<T>,
    update: UpdateQuery<T>,
    filter?: FilterQuery<T>,
    options?: QueryOptions,
  ): Promise<boolean> {
    return this.updateOneByFilter(
      identity,
      update,
      applyShardQueryFilter(profileRelation, filter),
      options,
    );
  }

  async findOneAndSetByProfileAndId(
    profileRelation: ProfileShard,
    id: DocumentIdentity<T>,
    updateSet: UpdateQuerySet<T>,
    options?: IFindAndUpdateQueryOptions<T>,
  ): Promise<T | null> {
    return this.findOneAndUpdateByProfileAndId(
      profileRelation,
      id,
      { $set: <any>updateSet },
      options,
    );
  }

  async findOneAndUpdateByProfileAndId(
    profileRelation: ProfileShard,
    id: DocumentIdentity<T>,
    update: UpdateQuery<T>,
    options?: IFindAndUpdateQueryOptions<T>,
  ): Promise<T | null> {
    return this.findOneAndUpdateByFilter(
      id,
      update,
      applyShardQueryFilter(profileRelation),
      options,
    );
  }

  async findOneAndUpdateByProfileAndFilter(
    profileRelation: ProfileShard,
    id: DocumentIdentity<T>,
    update: UpdateQuery<T>,
    filter?: FilterQuery<T>,
    options?: IFindAndUpdateQueryOptions<T>,
  ): Promise<T | null> {
    return this.findOneAndUpdateByFilter(
      id,
      update,
      applyShardQueryFilter(profileRelation, filter),
      options,
    );
  }

  async updateSetBulkByProfile(
    profileRelation: ProfileShard,
    updates: { id: DocumentIdentity<T>; update: UpdateQuerySet<T> }[],
    options?: IBulkBaseQueryOptions,
  ) {
    await this.model.bulkWrite(
      updates.map((update) => ({
        updateOne: <any>{
          filter: applyShardQueryFilter(profileRelation, {
            _id: this.assureDocumentId(update.id),
          }),
          update: { $set: update.update },
        },
      })),
      options,
    );
  }

  async deleteAllByProfile(
    profileRelation: ProfileShard,
    options?: DeleteOptions,
  ): Promise<number> {
    return this.deleteMany(applyShardQueryFilter(profileRelation), options);
  }

  async deleteManyByProfile(
    profileRelation: ProfileShard,
    filter: FilterQuery<T>,
    options?: DeleteOptions,
  ): Promise<number> {
    return this.deleteMany(applyShardQueryFilter(profileRelation, filter), options);
  }

  async deleteOneByProfile(
    profileRelation: ProfileShard,
    filter: FilterQuery<T>,
    options?: DeleteOptions,
  ): Promise<boolean> {
    return this.deleteOne(applyShardQueryFilter(profileRelation, filter), options);
  }
}

function applyShardQueryFilter(profileRelation: ProfileShard, filter?: FilterQuery<any>) {
  filter = filter || {};
  if (profileRelation.oid) {
    filter.oid = assureObjectId(profileRelation.oid);
  } else {
    console.warn(new Error('Use of profile filter without given oid').stack);
  }
  filter.pid = assureProfileId(profileRelation);
  return filter;
}

function assureProfileId(profileRelation: ProfileShard): Profile['_id'] {
  return profileRelation instanceof Profile
    ? profileRelation._id
    : (assureObjectId(profileRelation.pid) as Profile['_id']);
}
