import { IProfileMembershipClient } from './profile-membership.endpoint';
import { MembershipModel, UpdateProfileMembershipSettings } from '../models';
import { useSingleton } from '@lyvely/common';
import profileMembershipRepository from './profile-membership.repository';
import { IProfileApiRequestOptions, unwrapAndTransformResponse, unwrapResponse } from '@/endpoints';

class ProfileMembershipClient implements IProfileMembershipClient {
  async update(
    dto: UpdateProfileMembershipSettings,
    options?: IProfileApiRequestOptions,
  ): Promise<MembershipModel> {
    return unwrapAndTransformResponse(
      profileMembershipRepository.update(dto, options),
      MembershipModel,
    );
  }

  async updateAvatar(formData: any) {
    return unwrapResponse(profileMembershipRepository.updateAvatar(formData));
  }

  async updateGravatar() {
    return unwrapResponse(profileMembershipRepository.updateGravatar());
  }
}

export const useProfileMembershipClient = useSingleton<ProfileMembershipClient>(
  () => new ProfileMembershipClient(),
);
