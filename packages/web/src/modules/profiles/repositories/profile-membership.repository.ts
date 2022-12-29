import repository from '@/repository';
import {
  ENDPOINT_PROFILE_MEMBERSHIP,
  EndpointResult,
  IProfileMembershipService,
  UpdateProfileMembershipSettingsDto,
} from '@lyvely/common';

export default {
  async update(dto: UpdateProfileMembershipSettingsDto) {
    return repository.post<EndpointResult<IProfileMembershipService['update']>>(
      `${ENDPOINT_PROFILE_MEMBERSHIP}`,
      dto,
    );
  },
};
