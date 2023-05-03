import { StrictEndpoint } from '@/endpoints';
import { InvitationRequest, MailInvitationInfo } from '../models/invitations.model';

export interface IInvitationsService {
  sendInvitations(invite: InvitationRequest): Promise<void>;
  getMailInvitationInfo(token: string): Promise<MailInvitationInfo>;
}

export type InvitationsEndpoint = StrictEndpoint<IInvitationsService>;
export const ENDPOINT_INVITATIONS = 'invitations';
