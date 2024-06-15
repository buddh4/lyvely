import { AbstractDao, assureObjectId, Dao, DocumentIdentity } from '@/core';
import { UserInvitation } from '../schemas';
import { User } from '@/users';
import { Profile } from '@/profiles';

@Dao(UserInvitation)
export class UserInvitationDao extends AbstractDao<UserInvitation> {
  async findByProfileAndInvitee(
    profile: DocumentIdentity<Profile>,
    invitee: DocumentIdentity<User>
  ) {
    return this.findOne({
      pid: assureObjectId(profile),
      uid: assureObjectId(invitee),
    });
  }
}
