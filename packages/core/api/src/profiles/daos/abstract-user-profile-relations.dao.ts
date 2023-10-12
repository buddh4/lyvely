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

@Injectable()
export abstract class AbstractUserProfileRelationsDao<
  T extends UserProfileRelation = UserProfileRelation,
> extends AbstractDao<T> {
  async findAllByUser(
    user: EntityIdentity<User>,
    options: IFetchQueryOptions<T> = defaultFetchOptions,
  ): Promise<T[]> {
    return this.findAll({ uid: assureObjectId(user) }, options);
  }

  async findAllByUserAndProfile(
    user: EntityIdentity<User>,
    profile: EntityIdentity<Profile>,
    options: IFetchQueryOptions<T> = defaultFetchOptions,
  ): Promise<T[]> {
    return this.findAll({ uid: assureObjectId(user), pid: assureObjectId(profile) }, options);
  }

  async findAllProfileAndOrganizationRelationsByUser(
    user: EntityIdentity<User> | null | undefined,
    profile: Profile,
    options: IFetchQueryOptions<T> = defaultFetchOptions,
  ): Promise<{ profileRelations: T[]; organizationRelations?: T[] }> {
    if (!user) return { profileRelations: [], organizationRelations: [] };

    if (!profile.hasOrganization()) {
      return { profileRelations: await this.findAllByUserAndProfile(user, profile, options) };
    }

    const allRelations = this.findAll(
      {
        $or: [
          { uid: assureObjectId(user), pid: assureObjectId(profile) },
          { uid: assureObjectId(user), pid: assureObjectId(profile.oid) },
        ],
      },
      options,
    );

    return {
      profileRelations: (await allRelations).filter((rel) => rel.pid.equals(profile._id)),
      organizationRelations: (await allRelations).filter((rel) => rel.pid.equals(profile.oid)),
    };
  }

  async findAllByProfile(profile: EntityIdentity<Profile>): Promise<T[]> {
    return this.findAll(
      { pid: assureObjectId(profile) },
      { sort: { createdAt: 1 } as QuerySort<T> },
    );
  }

  async findByUserAndProfile(
    user: EntityIdentity<User>,
    profile: EntityIdentity<Profile>,
  ): Promise<T | null> {
    return this.findOne<UserProfileRelation>({
      uid: assureObjectId(user),
      pid: assureObjectId(profile),
    });
  }
}
