import { AbstractDao, assureObjectId, EntityIdentity } from '@lyvely/core';
import { UserInvitation } from '../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@lyvely/users';
import { Profile } from '@lyvely/profiles';

export class UserInvitationDao extends AbstractDao<UserInvitation> {
  @InjectModel(UserInvitation.name)
  protected model: Model<UserInvitation>;

  async findByProfileAndInvitee(profile: EntityIdentity<Profile>, invitee: EntityIdentity<User>) {
    return this.findOne({
      pid: assureObjectId(profile),
      uid: assureObjectId(invitee),
    });
  }

  getModuleId(): string {
    return 'invitations';
  }

  getModelConstructor() {
    return UserInvitation;
  }
}