import { UserInvites } from '../models';
import { StrictEndpoint } from '@/endpoints';

export interface IUserInvitesEndpointService {
  inviteUsers(model: UserInvites);
}

export type UserInvitesEndpoint = StrictEndpoint<IUserInvitesEndpointService>;
export const ENDPOINT_USER_INVITES = 'user-invites';
