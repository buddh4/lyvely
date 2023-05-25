import { UserPolicy } from '@/users/policies/UserPolicy';

export interface IInvitationsConfiguration {
  policy?: UserPolicy;
  allowedHosts?: string[];
}
