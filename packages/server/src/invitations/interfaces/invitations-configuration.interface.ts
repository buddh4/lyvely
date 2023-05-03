import { LaxUserCanInvitePolicy } from '@/invitations/policies/lax-user-can-invite.policy';

export interface IInvitationsConfiguration {
  policy?: LaxUserCanInvitePolicy;
  allowedHosts?: string[];
}
