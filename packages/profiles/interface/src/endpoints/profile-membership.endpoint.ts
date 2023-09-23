import { StrictEndpoint } from '@lyvely/common';
import { UpdateProfileMembershipSettings, MembershipModel } from '../models';

export interface IProfileMembershipService {
  update(update: UpdateProfileMembershipSettings): Promise<MembershipModel>;
}

export type ProfileMembershipEndpoint = StrictEndpoint<IProfileMembershipService>;
export const ENDPOINT_PROFILE_MEMBERSHIP = 'profile-membership';
