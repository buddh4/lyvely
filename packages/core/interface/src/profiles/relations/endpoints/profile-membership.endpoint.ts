import { StrictEndpoint, profileApiPrefix } from '@/endpoints';
import { MembershipModel, UpdateProfileMembershipSettings } from '../models';
import type { IUpdateAvatarClient } from '../../../avatars';

export interface IProfileMembershipClient extends IUpdateAvatarClient {
  update(update: UpdateProfileMembershipSettings): Promise<MembershipModel>;
}

export type ProfileMembershipEndpoint = StrictEndpoint<IProfileMembershipClient>;
export const API_PROFILE_MEMBERSHIP = profileApiPrefix('membership');

export const ProfileMembershipEndpoints = {
  UPDATE_AVATAR: 'update-avatar',
  UPDATE_GAVATAR: 'update-gravatar',
};
