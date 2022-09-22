import { InviteProfileMembers } from "../dtos";
import { StrictEndPoint } from "../../util";

export interface IInviteProfileUsersEndpoint {
  inviteMembers(users: InviteProfileMembers);
}

export type InviteProfileUsersEndpoint = StrictEndPoint<IInviteProfileUsersEndpoint>;
export const ENDPOINT_INVITE_PROFILE_USERS = 'invite-profile-users';
