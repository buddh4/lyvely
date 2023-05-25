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

  async getUserInvitationInfo(pid: string) {
    return repository.get<EndpointResult<IInvitationsService['getUserInvitationInfo']>>(
      `${ENDPOINT_INVITATIONS}/user/${pid}`,
    );
  },

  async accept(pid: string) {
    return repository.post<EndpointResult<IInvitationsService['accept']>>(
      `${ENDPOINT_INVITATIONS}/accept/${pid}`,
    );
  },

  async decline(pid: string) {
    return repository.post<EndpointResult<IInvitationsService['decline']>>(
      `${ENDPOINT_INVITATIONS}/decline/${pid}`,
    );
  },
};
