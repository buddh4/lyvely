import { API_PROFILE_MEMBERSHIP, IProfileMembershipClient } from './profile-membership.endpoint';
import { UpdateProfileMembershipSettings } from '../models';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<IProfileMembershipClient>(API_PROFILE_MEMBERSHIP);

export default {
  async update(dto: UpdateProfileMembershipSettings, options?: IProfileApiRequestOptions) {
    return api.post<'update'>(dto, {}, options);
  },
};
