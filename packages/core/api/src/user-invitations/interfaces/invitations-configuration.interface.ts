import { IUserContext } from '@/users';

export interface IInvitationsConfiguration {
  policy?: IUserContext;
  allowedHosts?: string[];
}
