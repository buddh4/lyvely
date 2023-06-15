import { AbstractDao, EntityIdentity } from '@lyvely/server-core';
import { Invitation, MailInvitation, UserInvitation } from '../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/users';
import { DeepPartial, subtractDays } from '@lyvely/common';

export class MailInvitationDao extends AbstractDao<MailInvitation> {
  @InjectModel(MailInvitation.name)
  protected model: Model<MailInvitation>;

  async findByToken(token: string): Promise<MailInvitation> {
    return this.findOne({ token });
  }

  getModuleId(): string {
    return 'invitations';
  }

  getModelConstructor() {
    return MailInvitation;
  }
}
