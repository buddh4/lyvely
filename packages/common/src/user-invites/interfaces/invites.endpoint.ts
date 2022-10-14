import { UserInvites } from '../dtos';
import { StrictEndpoint } from '@/endpoints';

export interface IUserInvitesService {
  inviteUsers(model: UserInvites);
}

export type UserInvitesEndpoint = StrictEndpoint<IUserInvitesService>;
export const ENDPOINT_USER_INVITES = 'user-invites';
