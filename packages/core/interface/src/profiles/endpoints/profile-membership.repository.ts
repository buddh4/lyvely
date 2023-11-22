import {
  ENDPOINT_PROFILE_MEMBERSHIP,
  IProfileMembershipClient,
} from './profile-membership.endpoint';
import { UpdateProfileMembershipSettings } from '../models';
import { useApi } from '@/repository';

const api = useApi<IProfileMembershipClient>(ENDPOINT_PROFILE_MEMBERSHIP);

export default {
  async update(dto: UpdateProfileMembershipSettings) {
    return api.post<'update'>(dto);
  },
};
