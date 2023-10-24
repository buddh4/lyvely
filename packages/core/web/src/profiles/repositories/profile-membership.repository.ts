import { repository } from '@/core';
import {
  ENDPOINT_PROFILE_MEMBERSHIP,
  IProfileMembershipService,
  UpdateProfileMembershipSettings,
} from '@lyvely/core-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async update(dto: UpdateProfileMembershipSettings) {
    return repository.post<EndpointResult<IProfileMembershipService['update']>>(
      `${ENDPOINT_PROFILE_MEMBERSHIP}`,
      dto,
    );
  },
};
