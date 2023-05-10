import { Injectable } from '@nestjs/common';
import { assureStringId } from '@/core';
import { MailInvitation } from '@/invitations/schemas';
import { EntityNotFoundException, MailInvitationInfo } from '@lyvely/common';
import { InvitationsService } from '@/invitations/services/invitations.service';

@Injectable()
export class MailInvitesService {
  constructor(private invitationsService: InvitationsService) {}

  async getMailInvitationInfo(token: string) {
    if (!token) throw new EntityNotFoundException();

    const invitationMetadata = await this.invitationsService.getInvitationMetadata(token);
    if (!(invitationMetadata.invitation instanceof MailInvitation))
      throw new EntityNotFoundException();

    const { invitee, host, profile, invitation } = invitationMetadata;

    if (!(await this.invitationsService.validateInvitationMetadata(invitationMetadata))) {
      throw new EntityNotFoundException('invitations.errors.invalid');
    }

    return new MailInvitationInfo({
      email: invitation.email,
      pid: assureStringId(profile, true),
      profileName: profile?.name,
      isVerifiedMail: !!invitee,
      hostName: host?.getDisplayName(),
      hostGuid: host?.guid,
      hostId: host?.id,
    });
  }
}
