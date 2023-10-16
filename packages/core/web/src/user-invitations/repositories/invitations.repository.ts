import { repository } from '@/core';
import {
  ENDPOINT_USER_INVITATIONS,
  InvitationRequest,
  IUserInvitationsService,
} from '@lyvely/core-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async sendInvitations(invite: InvitationRequest) {
    return repository.post<EndpointResult<IUserInvitationsService['sendInvitations']>>(
      `${ENDPOINT_USER_INVITATIONS}`,
      invite,
    );
  },

  async getMailInvitationInfo(token: string) {
    return repository.get<EndpointResult<IUserInvitationsService['getMailInvitationInfo']>>(
      `${ENDPOINT_USER_INVITATIONS}/mail/${token}`,
    );
  },

  async getUserInvitationInfo(pid: string) {
    return repository.get<EndpointResult<IUserInvitationsService['getUserInvitationInfo']>>(
      `${ENDPOINT_USER_INVITATIONS}/user/${pid}`,
    );
  },

  async accept(pid: string) {
    return repository.post<EndpointResult<IUserInvitationsService['accept']>>(
      `${ENDPOINT_USER_INVITATIONS}/accept/${pid}`,
    );
  },

  async decline(pid: string) {
    return repository.post<EndpointResult<IUserInvitationsService['decline']>>(
      `${ENDPOINT_USER_INVITATIONS}/decline/${pid}`,
    );
  },
};
