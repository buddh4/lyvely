import {
  IProfileMembershipService,
  useSingleton,
  MembershipModel,
  UpdateProfileMembershipSettings,
} from '@lyvely/common';
import profileMembershipRepository from '@/modules/profiles/repositories/profile-membership.repository';
import { unwrapResponse } from '@/modules/core';

class ProfileMembershipService implements IProfileMembershipService {
  async update(dto: UpdateProfileMembershipSettings): Promise<MembershipModel> {
    return unwrapResponse(profileMembershipRepository.update(dto)).then(
      (membership) => new MembershipModel(membership),
    );
  }
}

export const useProfileMembershipService = useSingleton<ProfileMembershipService>(
  () => new ProfileMembershipService(),
);
