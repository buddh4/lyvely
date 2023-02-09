import { LaxUserCanInvitePolicy } from '@/user-invites/policies/lax-user-can-invite.policy';

export interface IUserInvitesConfiguration {
  policy?: LaxUserCanInvitePolicy;
  allowedHosts?: string[];
}
