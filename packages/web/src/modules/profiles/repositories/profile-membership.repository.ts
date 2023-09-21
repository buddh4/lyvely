import repository from '@/repository';
import {
  ENDPOINT_PROFILE_MEMBERSHIP,
  EndpointResult,
  IProfileMembershipService,
  UpdateProfileMembershipSettings,
} from '@lyvely/common';

export default {
  async update(dto: UpdateProfileMembershipSettings) {
    return repository.post<EndpointResult<IProfileMembershipService['update']>>(
      `${ENDPOINT_PROFILE_MEMBERSHIP}`,
      dto,
    );
  },
};
