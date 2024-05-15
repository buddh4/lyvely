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
 */
export abstract class ProfileShardDao<
  T extends ProfileShard,
  TVersions extends BaseDocument = T,
> extends AbstractDao<T, TVersions> {
  async findByProfileAndId(
    profileRelation: ProfileShardData,
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
    profileRelation: ProfileShardData,
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
    profileRelation: ProfileShardData,
    filter?: FilterQuery<C>,
    options?: IFetchQueryOptions<T>,
  ): Promise<T[]> {
    return this.findAll(applyShardQueryFilter(profileRelation, filter), options);
  }

  async findOneByProfile<C = T>(
    profileRelation: ProfileShardData,
    filter: FilterQuery<C>,
    options?: IBaseFetchQueryOptions<T>,
  ): Promise<T | null> {
    return this.findOne(applyShardQueryFilter(profileRelation, filter), options);
  }

  async updateOneByProfileAndIdSet(
    profileRelation: ProfileShardData,
    id: DocumentIdentity<T>,
    updateSet: UpdateQuerySet<T>,
    options?: UpdateOptions<T>,
  ) {
    return this.updateOneByProfileAndId(profileRelation, id, { $set: <any>updateSet }, options);
  }

  async updateOneByProfileAndId(
    profileRelation: ProfileShardData,
    id: DocumentIdentity<T>,
    update: UpdateQuery<T>,
    options?: UpdateOptions<T>,
  ) {
    return this.updateOneByFilter(id, update, applyShardQueryFilter(profileRelation), options);
  }

  protected async updateOneByProfileAndFilter(
    profileRelation: ProfileShardData,
    identity: DocumentIdentity<T>,
    update: UpdateQuery<T>,
    filter?: FilterQuery<T>,
    options?: UpdateOptions<T>,
  ): Promise<boolean> {
    return this.updateOneByFilter(
      identity,
      update,
      applyShardQueryFilter(profileRelation, filter),
      options,
    );
  }

  async findOneAndSetByProfileAndId(
    profileRelation: ProfileShardData,
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
    profileRelation: ProfileShardData,
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
    profileRelation: ProfileShardData,
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
    profileRelation: ProfileShardData,
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
    profileRelation: ProfileShardData,
    options?: DeleteOptions,
  ): Promise<number> {
    return this.deleteMany(applyShardQueryFilter(profileRelation), options);
  }

  async deleteManyByProfile(
    profileRelation: ProfileShardData,
    filter: FilterQuery<T>,
    options?: DeleteOptions,
  ): Promise<number> {
    return this.deleteMany(applyShardQueryFilter(profileRelation, filter), options);
  }

  async deleteOneByProfile(
    profileRelation: ProfileShardData,
    filter: FilterQuery<T>,
    options?: DeleteOptions,
  ): Promise<boolean> {
    return this.deleteOne(applyShardQueryFilter(profileRelation, filter), options);
  }
}

function applyShardQueryFilter(profileRelation: ProfileShardData, filter?: FilterQuery<any>) {
  filter = filter || {};
  if (profileRelation.oid) {
    filter.oid = assureObjectId(profileRelation.oid);
  } else {
    console.warn(new Error('Use of profile filter without given oid').stack);
  }
  filter.pid = assureProfileId(profileRelation);
  return filter;
}

function assureProfileId(profileRelation: ProfileShardData): Profile['_id'] {
  return profileRelation instanceof Profile
    ? profileRelation._id
    : (assureObjectId(profileRelation.pid) as Profile['_id']);
}
