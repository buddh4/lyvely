import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Membership, MembershipDocument, Profile } from '../schemas';
import { User } from '../../users';
import { AbstractUserProfileRelationsDao } from './abstract-user-profile-relations.dao';
import { assureObjectId, EntityIdentity } from '../../core/db/db.utils';
import { Constructor, BaseMembershipRole } from '@lyvely/common';
import { SaveOptions } from "../../core/db/abstract.dao";

@Injectable()
export class MembershipsDao extends AbstractUserProfileRelationsDao<Membership>{
  constructor(@InjectModel(Membership.name) protected model: Model<MembershipDocument>) {
    super();
  }

  async addMembership(profile: Profile, user: User, role: string = BaseMembershipRole.Member, options?: SaveOptions): Promise<Membership> {
    return this.save(Membership.create({ profile, user, role }), options);
  }

  async findByUserAndProfileRole(user: EntityIdentity<User>, profile: EntityIdentity<Profile>, role: string): Promise<Membership|null> {
    return this.model.findOne({
      uid: assureObjectId(user),
      pid: assureObjectId(profile),
      role: role
    }).lean();
  }

  getModelConstructor(): Constructor<Membership> {
    return Membership;
  }

  getModuleId(): string {
    return 'profiles';
  }
}
