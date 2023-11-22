import {
  ENDPOINT_USER_INVITATIONS,
  InvitationRequest,
  IUserInvitationsService,
  useApiRepository,
} from '@lyvely/interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async sendInvitations(invite: InvitationRequest) {
    return useApiRepository().post<EndpointResult<IUserInvitationsService['sendInvitations']>>(
      `${ENDPOINT_USER_INVITATIONS}`,
      invite,
    );
  },

  async getMailInvitationInfo(token: string) {
    return useApiRepository().get<EndpointResult<IUserInvitationsService['getMailInvitationInfo']>>(
      `${ENDPOINT_USER_INVITATIONS}/mail/${token}`,
    );
  },

  async getUserInvitationInfo(pid: string) {
    return useApiRepository().get<EndpointResult<IUserInvitationsService['getUserInvitationInfo']>>(
      `${ENDPOINT_USER_INVITATIONS}/user/${pid}`,
    );
  },

  async accept(pid: string) {
    return useApiRepository().post<EndpointResult<IUserInvitationsService['accept']>>(
      `${ENDPOINT_USER_INVITATIONS}/accept/${pid}`,
    );
  },

  async decline(pid: string) {
    return useApiRepository().post<EndpointResult<IUserInvitationsService['decline']>>(
      `${ENDPOINT_USER_INVITATIONS}/decline/${pid}`,
    );
  },
};
