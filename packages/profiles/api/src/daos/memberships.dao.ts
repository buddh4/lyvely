import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Membership, MembershipDocument, Profile } from '../schemas';
import { User } from '@lyvely/users';
import { AbstractUserProfileRelationsDao } from './abstract-user-profile-relations.dao';
import { assureObjectId, EntityIdentity, IBaseQueryOptions, SaveOptions } from '@lyvely/core';
import { BaseMembershipRole } from '@lyvely/profiles-interface';
import { Constructor } from '@lyvely/common';

@Injectable()
export class MembershipsDao extends AbstractUserProfileRelationsDao<Membership> {
  constructor(@InjectModel(Membership.name) protected model: Model<Membership>) {
    super();
  }

  async addMembership(
    profile: Profile,
    user: User,
    role: string = BaseMembershipRole.Member,
    options?: SaveOptions,
  ): Promise<Membership> {
    return this.save(Membership.create({ profile, user, role }), options);
  }

  async findByProfileAndUser(
    profile: EntityIdentity<Profile>,
    user: EntityIdentity<User>,
    options?: IBaseQueryOptions,
  ): Promise<Membership | null> {
    return this.findOne(
      {
        uid: assureObjectId(user),
        pid: assureObjectId(profile),
      },
      options,
    );
  }

  getModelConstructor(): Constructor<Membership> {
    return Membership;
  }

  getModuleId(): string {
    return 'profiles';
  }
}
