import repository from '@/repository';
import {
  ENDPOINT_PROFILE_MEMBERSHIP,
  IProfileMembershipService,
  UpdateProfileMembershipSettings,
} from '@lyvely/profiles-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async update(dto: UpdateProfileMembershipSettings) {
    return repository.post<EndpointResult<IProfileMembershipService['update']>>(
      `${ENDPOINT_PROFILE_MEMBERSHIP}`,
      dto,
    );
  },
};
