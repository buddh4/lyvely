import { AbstractDao, Dao } from '@/core';
import { MailInvitation } from '../schemas';
import { TenancyIsolation } from '@/core/tenancy';

@Dao(MailInvitation, { isolation: TenancyIsolation.Strict })
export class MailInvitationDao extends AbstractDao<MailInvitation> {
  async findByToken(token: string): Promise<MailInvitation | null> {
    return this.findOne({ token });
  }
}
