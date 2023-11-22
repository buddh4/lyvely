import {
  ENDPOINT_PROFILE_MEMBERSHIP,
  IProfileMembershipService,
  UpdateProfileMembershipSettings,
  useApiRepository,
} from '@lyvely/interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async update(dto: UpdateProfileMembershipSettings) {
    return useApiRepository().post<EndpointResult<IProfileMembershipService['update']>>(
      `${ENDPOINT_PROFILE_MEMBERSHIP}`,
      dto,
    );
  },
};
