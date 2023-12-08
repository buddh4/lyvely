import { StrictEndpoint } from '@/endpoints';
import { InvitationRequest, MailInvitationInfo, UserInvitationInfo } from '../models';

export interface IUserInvitationsClient {
  sendInvitations(invite: InvitationRequest): Promise<void>;
  getMailInvitationInfo(token: string): Promise<MailInvitationInfo | null>;
  getUserInvitationInfo(pid: string): Promise<UserInvitationInfo | null>;
  accept(pid: string): Promise<void>;
  decline(pid: string): Promise<void>;
}

export type UserInvitationsEndpoint = StrictEndpoint<IUserInvitationsClient>;
export const API_USER_INVITATIONS = 'user-invitations';

export const UserInvitationsEndpoints = {
  MAIL: (token: string) => `mail/${token}`,
  USER: (pid: string) => `user/${pid}`,
  ACCEPT: (pid: string) => `accept/${pid}`,
  DECLINE: (pid: string) => `decline/${pid}`,
};
