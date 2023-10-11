import { AbstractDao } from '@/core';
import { MailInvitation } from '../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class MailInvitationDao extends AbstractDao<MailInvitation> {
  @InjectModel(MailInvitation.name)
  protected model: Model<MailInvitation>;

  async findByToken(token: string): Promise<MailInvitation | null> {
    return this.findOne({ token });
  }

  getModuleId(): string {
    return 'invitations';
  }

  getModelConstructor() {
    return MailInvitation;
  }
}
