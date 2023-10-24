import { StrictEndpoint } from '@lyvely/common';
import { InvitationRequest, MailInvitationInfo, UserInvitationInfo } from '../models';

export interface IUserInvitationsService {
  sendInvitations(invite: InvitationRequest): Promise<void>;
  getMailInvitationInfo(token: string): Promise<MailInvitationInfo | null>;
  getUserInvitationInfo(pid: string): Promise<UserInvitationInfo | null>;
  accept(pid: string): Promise<void>;
  decline(pid: string): Promise<void>;
}

export type UserInvitationsEndpoint = StrictEndpoint<IUserInvitationsService>;
export const ENDPOINT_USER_INVITATIONS = 'invitations';
