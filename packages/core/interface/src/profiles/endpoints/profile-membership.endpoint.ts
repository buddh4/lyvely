import { StrictEndpoint, profileApiPrefix } from '@/endpoints';
import {
  MembershipModel,
  UpdateProfileMembershipSettings,
  UpdateUserRelationsResponse,
} from '../models';
import type { IUpdateAvatarClient, IUpdateGravatarClient } from '@/avatars';

export interface IProfileMembershipClient extends IUpdateAvatarClient, IUpdateGravatarClient {
  update(update: UpdateProfileMembershipSettings): Promise<MembershipModel>;
  revoke(): Promise<UpdateUserRelationsResponse>;
}

export type ProfileMembershipEndpoint = StrictEndpoint<IProfileMembershipClient>;
export const API_PROFILE_MEMBERSHIP = profileApiPrefix('membership');

export const ProfileMembershipEndpoints = {
  UPDATE_AVATAR: 'update-avatar',
  UPDATE_GAVATAR: 'update-gravatar',
  REVOKE: 'revoke',
};
