import { StrictEndpoint } from '@/endpoints';
import { UpdateProfileMembershipSettingsDto } from '../dtos';
import { MembershipModel } from '../models';

export interface IProfileMembershipService {
  update(update: UpdateProfileMembershipSettingsDto): Promise<MembershipModel>;
}

export type ProfileMembershipEndpoint = StrictEndpoint<IProfileMembershipService>;
export const ENDPOINT_PROFILE_MEMBERSHIP = 'profile-membership';
