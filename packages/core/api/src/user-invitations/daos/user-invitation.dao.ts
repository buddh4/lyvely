import { AbstractDao, assureObjectId, EntityIdentity, Model } from '@/core';
import { UserInvitation } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/users';
import { Profile } from '@/profiles';

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
