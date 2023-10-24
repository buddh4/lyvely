import { AbstractDao, EntityIdentity, Model } from '@/core';
import { Invitation, MailInvitation, UserInvitation } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/users';
import { subtractDays } from '@lyvely/dates';
import { DeepPartial } from '@lyvely/common';

export class InvitationDao extends AbstractDao<Invitation> {
  @InjectModel(Invitation.name)
  protected model: Model<Invitation>;

  countInvitesByUserThisWeek(user: EntityIdentity<User>) {
    return this.model.count({
      updatedAt: { $gte: subtractDays(new Date(), 7) },
    });
  }

  getModelConstructor(model: DeepPartial<Invitation>) {
    if (model.type === MailInvitation.name) return MailInvitation;
    if (model.type === UserInvitation.name) return UserInvitation;
    return Invitation;
  }

  getModuleId(): string {
    return 'invitations';
  }
}
