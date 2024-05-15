import { AbstractDao, DocumentIdentity, LeanDoc, Model } from '@/core';
import { Invitation, MailInvitation, UserInvitation } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/users';
import { subtractDays } from '@lyvely/dates';

export class InvitationDao extends AbstractDao<Invitation> {
  @InjectModel(Invitation.name)
  protected model: Model<Invitation>;

  countInvitesByUserThisWeek(user: DocumentIdentity<User>) {
    return this.model.countDocuments({
      updatedAt: { $gte: subtractDays(new Date(), 7) },
    });
  }

  getModelConstructor(model: LeanDoc<Invitation>) {
    if (model.type === MailInvitation.name) return MailInvitation;
    if (model.type === UserInvitation.name) return UserInvitation;
    return Invitation;
  }

  getModuleId(): string {
    return 'invitations';
  }
}
