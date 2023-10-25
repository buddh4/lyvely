import { Injectable } from '@nestjs/common';
import {
  AbstractDao,
  defaultFetchOptions,
  IFetchQueryOptions,
  assureObjectId,
  EntityIdentity,
  QuerySort,
} from '@/core';
import { Profile, UserProfileRelation } from '../schemas';
import { User } from '@/users';

/**
 * Abstract Data Access Object for accessing user relation information.
 * Types of user relation may extend this class for accessing specific types of user relations.
 */
@Injectable()
export abstract class AbstractUserProfileRelationsDao<
  T extends UserProfileRelation = UserProfileRelation,
> extends AbstractDao<T> {
  /**
   * Finds all user relations based on the user entity.
   * @param {EntityIdentity<User>} user - The user entity to search relations for.
   * @param {IFetchQueryOptions<T>} options - The query options for fetching user relations.
   * @returns {Promise<T[]>} - A promise that resolves to an array of user relations.
   */
  async findAllByUser(
    user: EntityIdentity<User>,
    options: IFetchQueryOptions<T> = defaultFetchOptions,
  ): Promise<T[]> {
    return this.findAll({ uid: assureObjectId(user) }, options);
  }

  /**
   * Finds all user relations based on the user entity.
   * @param {EntityIdentity<User>} user - The user entity to search relations for.
   * @param {IFetchQueryOptions<T>} options - The query options for fetching user relations.
   * @returns {Promise<T[]>} - A promise that resolves to an array of user relations.
   */
  async findOldestRelation(
    user: EntityIdentity<User>,
    options: IFetchQueryOptions<T> = defaultFetchOptions,
  ): Promise<T | null> {
    options.sort = { createdAt: -1 } as QuerySort<T>;
    return this.findOne({ uid: assureObjectId(user) }, options);
  }

  /**
   * Finds all user relations based on the user and profile entities.
   * @param {EntityIdentity<User>} user - The user entity to search relations for.
   * @param {EntityIdentity<Profile>} profile - The profile entity to search relations for.
   * @param {IFetchQueryOptions<T>} options - The query options for fetching user relations.
   * @returns {Promise<T[]>} - A promise that resolves to an array of user relations.
   */
  async findAllByUserAndProfile(
    user: EntityIdentity<User>,
    profile: EntityIdentity<Profile>,
    options: IFetchQueryOptions<T> = defaultFetchOptions,
  ): Promise<T[]> {
    return this.findAll({ uid: assureObjectId(user), pid: assureObjectId(profile) }, options);
  }

  /**
   * Finds all user relations for a profile and associated organization based on the user entity.
   * @param {EntityIdentity<User> | null | undefined} user - The user entity to search relations for. If null or undefined, function returns visitor relations.
   * @param {Profile} profile - The profile entity to search relations for. If the profile does not have an associated organization, only profile relations are returned.
   * @param {IFetchQueryOptions<T>} options - The query options for fetching user relations.
   * @returns {Promise<{ profileRelations: T[]; organizationRelations?: T[] }>} - A promise that resolves to an object containing arrays of user relations for both the profile and the organization.
   */
  async findAllProfileAndOrganizationRelationsByUser(
    profile: Profile,
    user?: EntityIdentity<User> | null | undefined,
    options: IFetchQueryOptions<T> = defaultFetchOptions,
  ): Promise<{ profileRelations: T[]; organizationRelations?: T[] }> {
    if (!user) return { profileRelations: [], organizationRelations: [] };

    if (!profile.hasOrganization()) {
      return { profileRelations: await this.findAllByUserAndProfile(user, profile, options) };
    }

    const allRelations = await this.findAll(
      {
        $or: [
          { uid: assureObjectId(user), pid: assureObjectId(profile) },
          { uid: assureObjectId(user), pid: assureObjectId(profile.oid) },
        ],
      },
      options,
    );

    return {
      profileRelations: allRelations.filter((rel) => rel.pid.equals(profile._id)),
      organizationRelations: allRelations.filter((rel) => rel.pid.equals(profile.oid)),
    };
  }

  /**
   * Finds all user relations based on the profile entity.
   * @param {EntityIdentity<Profile>} profile - The profile entity to search relations for.
   * @returns {Promise<T[]>} - A promise that resolves to an array of user relations.
   */
  async findAllByProfile(profile: EntityIdentity<Profile>): Promise<T[]> {
    return this.findAll(
      { pid: assureObjectId(profile) },
      { sort: { createdAt: 1 } as QuerySort<T> },
    );
  }

  /**
   * Finds a user relation between the user and profile entities.
   * @param {EntityIdentity<User>} user - The user entity to search the relation for.
   * @param {EntityIdentity<Profile>} profile - The profile entity to search the relation for.
   * @returns {Promise<T[]>} - A promise that resolves to an array of user relations.
   */
  async findByUserAndProfile(
    user: EntityIdentity<User>,
    profile: EntityIdentity<Profile>,
  ): Promise<T[]> {
    return this.findAll({
      uid: assureObjectId(user),
      pid: assureObjectId(profile),
    });
  }
}
