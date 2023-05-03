import repository from '@/repository';
import {
  ENDPOINT_INVITATIONS,
  EndpointResult,
  InvitationRequest,
  IInvitationsService,
} from '@lyvely/common';

export default {
  async sendInvitations(invite: InvitationRequest) {
    return repository.post<EndpointResult<IInvitationsService['sendInvitations']>>(
      `${ENDPOINT_INVITATIONS}`,
      invite,
    );
  },

  async getMailInvitationInfo(token: string) {
    return repository.get<EndpointResult<IInvitationsService['getMailInvitationInfo']>>(
      `${ENDPOINT_INVITATIONS}/mail/${token}`,
    );
  },
};
