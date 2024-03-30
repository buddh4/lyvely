import { StrictEndpoint, profileApiPrefix } from '@/endpoints';
import { MembershipModel, UpdateProfileMembershipSettings } from '../models';

export interface IProfileMembershipClient {
  update(update: UpdateProfileMembershipSettings): Promise<MembershipModel>;
}

export type ProfileMembershipEndpoint = StrictEndpoint<IProfileMembershipClient>;
export const API_PROFILE_MEMBERSHIP = profileApiPrefix('membership');
