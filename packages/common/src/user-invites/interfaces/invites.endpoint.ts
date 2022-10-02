import { UserInvites } from '../dtos';
import { StrictEndPoint } from '@/utils';

export interface IUserInvitesService {
  inviteUsers(model: UserInvites);
}

export type UserInvitesEndpoint = StrictEndPoint<IUserInvitesService>;
export const ENDPOINT_USER_INVITES = 'user-invites';
