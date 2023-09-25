import { UserPolicy } from '@lyvely/users';

export interface IInvitationsConfiguration {
  policy?: UserPolicy;
  allowedHosts?: string[];
}
