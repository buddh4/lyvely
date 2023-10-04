import { IUserContext } from '@lyvely/users';

export interface IInvitationsConfiguration {
  policy?: IUserContext;
  allowedHosts?: string[];
}
