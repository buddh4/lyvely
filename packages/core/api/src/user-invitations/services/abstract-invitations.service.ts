import { InvitationContextIF } from '../interfaces';
import { EntityNotFoundException } from '@lyvely/common';
import { UserStatus } from '@lyvely/interface';
import { Invitation } from '../schemas';

export abstract class AbstractInvitationsService<
  TInvitation extends Invitation,
  TContext extends InvitationContextIF,
  TInfo,
  TSearch,
> {
  abstract getInvitationContext(search: TSearch): Promise<TContext | null>;
  abstract getInvitation(search: TSearch): Promise<TInvitation | null>;
  abstract invalidateOtherInvitations(context: TInvitation): Promise<number>;
  protected abstract createInfoModel(context: TContext): TInfo;

  async getInvitationInfo(search: TSearch) {
    if (!search) return null;

    const invitationContext = await this.getInvitationContext(search);

    if (!(await this.validateInvitationContext(invitationContext))) {
      throw new EntityNotFoundException('invitations.errors.invalid');
    }

    return this.createInfoModel(invitationContext!);
  }

  async validateInvitationContext(metaData?: TContext | null): Promise<boolean> {
    if (!metaData?.invitation) return false;
    const { host, profile, invitation } = metaData;
    return host.status === UserStatus.Active && (!invitation.pid || !!profile);
  }
}
