import {
  IProfileMembershipService,
  MembershipModel,
  UpdateProfileMembershipSettings,
} from '@lyvely/core-interface';
import { useSingleton } from '@lyvely/common';
import profileMembershipRepository from '@/profiles/repositories/profile-membership.repository';
import { unwrapResponse } from '@/core';

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
