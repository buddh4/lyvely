import {
  AbstractDao,
  BaseFetchQueryOptions, BaseQueryOptions, DeleteOptions,
  FetchQueryOptions, FindAndUpdateQueryOptions, UpdateQueryOptions,
  UpdateQuerySet
} from "../../db/abstract.dao";
import { BaseProfileModel } from "./base-profile-model.schema";
import { Profile } from "../schemas";
import { assureObjectId, EntityIdentity } from "../../db/db.utils";
import { FilterQuery, QueryOptions, UpdateQuery, Types } from "mongoose";

/**
 * This type is used as compound type for different kinds of profile relation on DAO level.
 * The BaseProfileModelDao at least requires an oid and pid for most of its queries.
 */
export type ProfileRelation = Profile | BaseProfileModel<any> | { oid: Types.ObjectId, pid: Types.ObjectId };

/**
 * This Dao class serves as base class for profile related models.
 * Profile related models need to include an oid and pid field which should be used in all queries.
 */
export abstract class BaseProfileModelDao<T extends BaseProfileModel<T>> extends AbstractDao<T> {

  async findByProfileAndId(profileRelation: ProfileRelation, identity: EntityIdentity<T>, options?: BaseFetchQueryOptions<T>) {
    return this.findOne(applyProfileFilter(profileRelation,{ _id: this.assureEntityId(identity) }), options);
  }

  async findAllByProfileAndIds(profileRelation: ProfileRelation, ids: EntityIdentity<T>[], options?: FetchQueryOptions<T>) {
    return this.findAllByProfile(profileRelation,{ _id: { $in: ids.map(id => this.assureEntityId(id)) } }, options);
  }

  async findAllByProfile<C = T>(profileRelation: ProfileRelation, filter: FilterQuery<C>, options?: FetchQueryOptions<T>): Promise<T[]> {
    return this.findAll(applyProfileFilter(profileRelation, filter), options);
  }

  async findOneByProfile<C = T>(profileRelation: ProfileRelation, filter: FilterQuery<C>, options?: BaseFetchQueryOptions<T>): Promise<T|null> {
    return this.findOne(applyProfileFilter(profileRelation, filter), options)
  }

  async updateOneByProfileAndIdSet(profileRelation: ProfileRelation, id: EntityIdentity<T>, updateSet: UpdateQuerySet<T>, options?: BaseQueryOptions): Promise<number> {
    return this.updateOneByProfileAndId(profileRelation, id, { $set: <any> updateSet }, options);
  }

  async updateOneByProfileAndId(profileRelation: ProfileRelation, id: EntityIdentity<T>, update: UpdateQuery<T>, options?: UpdateQueryOptions) {
    return this.updateOneByFilter(id, update, applyProfileFilter(profileRelation), options);
  }

  async updateOneByProfileAndFilter(profileRelation: ProfileRelation, identity: EntityIdentity<T>, update: UpdateQuery<T>, filter?: FilterQuery<T>, options?: QueryOptions) {
    return this.updateOneByFilter(identity, update, applyProfileFilter(profileRelation, filter), options)
  }

  async findOneAndSetByProfileAndId(profileRelation: ProfileRelation, id: EntityIdentity<T>, updateSet: UpdateQuerySet<T>, options?: FindAndUpdateQueryOptions<T>): Promise<T|null> {
    return this.findOneAndUpdateByProfileAndId(profileRelation, id, { $set: <any> updateSet }, options);
  }

  async findOneAndUpdateByProfileAndId(profileRelation: ProfileRelation, id: EntityIdentity<T>, update: UpdateQuery<T>, options?: FindAndUpdateQueryOptions<T>): Promise<T|null> {
    return this.findOneAndUpdateByFilter(id, update, applyProfileFilter(profileRelation), options)
  }

  async findOneAndUpdateByProfileAndFilter(profileRelation: ProfileRelation, id: EntityIdentity<T>, update: UpdateQuery<T>, filter?: FilterQuery<T>, options?: FindAndUpdateQueryOptions<T>): Promise<T|null> {
    return this.findOneAndUpdateByFilter(id, update, applyProfileFilter(profileRelation, filter), options)
  }

  async updateSetBulkByProfile(profileRelation: ProfileRelation, updates: { id: EntityIdentity<T>, update: UpdateQuerySet<T> }[], options?: BaseQueryOptions) {
    await this.model.bulkWrite(
      updates.map(update => ({
          updateOne: {
            filter: applyProfileFilter(profileRelation, { _id: this.assureEntityId(update.id) }),
            update: { $set: update.update },
          }
        })
      ), options);
  }

  async deleteAllByProfile(profileRelation: ProfileRelation, options?: DeleteOptions): Promise<number> {
    return this.deleteMany(applyProfileFilter(profileRelation), options);
  }

  async deleteManyByProfile(profileRelation: ProfileRelation, filter: FilterQuery<T>, options?: DeleteOptions): Promise<number> {
    return this.deleteMany(applyProfileFilter(profileRelation, filter), options);
  }

  async deleteOneByProfile(profileRelation: ProfileRelation, filter: FilterQuery<T>, options?: DeleteOptions): Promise<boolean> {
    return this.deleteOne(applyProfileFilter(profileRelation, filter), options);
  }
}

function applyProfileFilter(profileRelation: ProfileRelation, filter?: FilterQuery<any>) {
  filter = filter || {}
  if(profileRelation.oid) {
    filter.oid = assureObjectId(profileRelation.oid)
  } else {
    console.warn(new Error('Use of profile filter without given oid').stack);
  }
  filter.pid = assureProfileId(profileRelation)
  return filter;
}

function assureProfileId(profileRelation: ProfileRelation): Profile['_id'] {
  return (profileRelation instanceof Profile) ? profileRelation._id : assureObjectId(profileRelation.pid);
}
