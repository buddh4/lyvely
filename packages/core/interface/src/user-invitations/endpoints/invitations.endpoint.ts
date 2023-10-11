import { StrictEndpoint } from '@lyvely/common';
import { InvitationRequest, MailInvitationInfo, UserInvitationInfo } from '../models';

export interface IInvitationsService {
  sendInvitations(invite: InvitationRequest): Promise<void>;
  getMailInvitationInfo(token: string): Promise<MailInvitationInfo | null>;
  getUserInvitationInfo(pid: string): Promise<UserInvitationInfo | null>;
  accept(pid: string): Promise<void>;
  decline(pid: string): Promise<void>;
}

export type InvitationsEndpoint = StrictEndpoint<IInvitationsService>;
export const ENDPOINT_INVITATIONS = 'invitations';
