import { UserInvites } from "../dtos";
import { StrictEndPoint } from "@/utils";

export interface IUserInvitesEndpoint {
  inviteUsers(model: UserInvites)
}

export type UserInvitesEndpoint = StrictEndPoint<IUserInvitesEndpoint>;
export const ENDPOINT_USER_INVITES = 'user-invites';
