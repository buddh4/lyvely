import {
  API_USER_INVITATIONS,
  IUserInvitationsClient,
  UserInvitationsEndpoints,
} from './user-invitations.endpoint';
import { InvitationRequest } from '../models';
import { useApi } from '@/repository';

const api = useApi<IUserInvitationsClient>(API_USER_INVITATIONS);

export default {
  async sendInvitations(invite: InvitationRequest) {
    return api.post<'sendInvitations'>(invite);
  },

  async getMailInvitationInfo(token: string) {
    return api.get<'getMailInvitationInfo'>(UserInvitationsEndpoints.MAIL(token));
  },

  async getUserInvitationInfo(pid: string) {
    return api.get<'getUserInvitationInfo'>(UserInvitationsEndpoints.USER(pid));
  },

  async accept(pid: string) {
    return api.post<'accept'>(UserInvitationsEndpoints.ACCEPT(pid));
  },

  async decline(pid: string) {
    return api.post<'decline'>(UserInvitationsEndpoints.DECLINE(pid));
  },
};
