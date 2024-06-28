import { AbstractDao, assureObjectId, Dao, DocumentIdentity } from '@/core';
import { Invitation, MailInvitation, UserInvitation } from '../schemas';
import { User } from '@/users';
import { subtractDays } from '@lyvely/dates';
import { TenancyIsolation } from '@/core/tenancy';

@Dao(Invitation, {
  discriminator: {
    [MailInvitation.name]: MailInvitation,
    [UserInvitation.name]: UserInvitation,
  },
  isolation: TenancyIsolation.Strict,
})
export class InvitationDao extends AbstractDao<Invitation> {
  async countInvitesByUserThisWeek(user: DocumentIdentity<User>) {
    return this.getModel().countDocuments({
      uid: assureObjectId(user),
      updatedAt: { $gte: subtractDays(new Date(), 7) },
    });
  }
}
