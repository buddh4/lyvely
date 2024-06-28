import { AbstractDao, assureObjectId, Dao, DocumentIdentity } from '@/core';
import { UserInvitation } from '../schemas';
import { User } from '@/users';
import { Profile } from '@/profiles';
import { TenancyIsolation } from '@/core/tenancy';

@Dao(UserInvitation, { isolation: TenancyIsolation.Strict })
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
