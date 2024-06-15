import { AbstractDao, Dao } from '@/core';
import { MailInvitation } from '../schemas';

@Dao(MailInvitation)
export class MailInvitationDao extends AbstractDao<MailInvitation> {
  async findByToken(token: string): Promise<MailInvitation | null> {
    return this.findOne({ token });
  }
}
