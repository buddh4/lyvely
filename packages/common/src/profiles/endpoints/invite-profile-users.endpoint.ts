import { StrictEndPoint } from '@/endpoints';
import { InviteProfileMembers } from '../dtos';

export interface IInviteProfileUsersService {
  inviteMembers(users: InviteProfileMembers);
}

export type InviteProfileUsersEndpoint = StrictEndPoint<IInviteProfileUsersService>;
export const ENDPOINT_INVITE_PROFILE_USERS = 'invite-profile-users';
