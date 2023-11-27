import { StrictEndpoint, profileApiPrefix } from '@/endpoints';
import { UpdateProfileMembershipSettings, MembershipModel } from '../models';

export interface IProfileMembershipClient {
  update(update: UpdateProfileMembershipSettings): Promise<MembershipModel>;
}

export type ProfileMembershipEndpoint = StrictEndpoint<IProfileMembershipClient>;
export const ENDPOINT_PROFILE_MEMBERSHIP = profileApiPrefix('profile-membership');
