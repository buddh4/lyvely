import {
  ENDPOINT_USER_INVITATIONS,
  IUserInvitationsClient,
  UserInvitationsEndpointPaths,
} from './user-invitations.endpoint';
import { InvitationRequest } from '../models';
import { useApi } from '@/repository';

const api = useApi<IUserInvitationsClient>(ENDPOINT_USER_INVITATIONS);

export default {
  async sendInvitations(invite: InvitationRequest) {
    return api.post<'sendInvitations'>(invite);
  },

  async getMailInvitationInfo(token: string) {
    return api.get<'getMailInvitationInfo'>(UserInvitationsEndpointPaths.MAIL(token));
  },

  async getUserInvitationInfo(pid: string) {
    return api.get<'getUserInvitationInfo'>(UserInvitationsEndpointPaths.USER(pid));
  },

  async accept(pid: string) {
    return api.post<'accept'>(UserInvitationsEndpointPaths.ACCEPT(pid));
  },

  async decline(pid: string) {
    return api.post<'decline'>(UserInvitationsEndpointPaths.DECLINE(pid));
  },
};
