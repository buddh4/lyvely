import { IProfileMembershipClient } from './profile-membership.endpoint';
import { MembershipModel, UpdateProfileMembershipSettings } from '../models';
import { useSingleton } from '@lyvely/common';
import profileMembershipRepository from './profile-membership.repository';
import { unwrapAndTransformResponse } from '@/endpoints';

class ProfileMembershipClient implements IProfileMembershipClient {
  async update(dto: UpdateProfileMembershipSettings): Promise<MembershipModel> {
    return unwrapAndTransformResponse(profileMembershipRepository.update(dto), MembershipModel);
  }
}

export const useProfileMembershipClient = useSingleton<ProfileMembershipClient>(
  () => new ProfileMembershipClient(),
);
