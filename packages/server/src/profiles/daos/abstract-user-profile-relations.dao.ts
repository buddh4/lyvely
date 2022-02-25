import { Injectable } from '@nestjs/common';
import { assureObjectId, EntityIdentity } from '../../db/db.utils';
import { AbstractDao, defaultFetchOptions, FetchQueryOptions } from '../../db/abstract.dao';
import { UserProfileRelation } from '../schemas/user-profile-relations.schema';
import { User } from '../../users/schemas/users.schema';
import { Profile } from '../schemas/profiles.schema';

@Injectable()
export abstract class AbstractUserProfileRelationsDao<T extends UserProfileRelation = UserProfileRelation> extends AbstractDao<T>{
  async findAllByUser(user: EntityIdentity<User>, options: FetchQueryOptions<T> = defaultFetchOptions): Promise<T[]> {
    return this.findAll({ uid: assureObjectId(user) }, options);
  }

  async findAllByUserAndProfile(
    user: EntityIdentity<User>,
    profile: EntityIdentity<Profile>,
    options: FetchQueryOptions<T> = defaultFetchOptions): Promise<T[]|null> {
    return this.findAll(
      { uid: assureObjectId(user), pid: assureObjectId(profile) },
      options
    );
  }

  async findByUserAndProfile(user: EntityIdentity<User>, profile: EntityIdentity<Profile>): Promise<T|null> {
    return this.findOne<UserProfileRelation>({uid: assureObjectId(user), pid: assureObjectId(profile)});
  }
}