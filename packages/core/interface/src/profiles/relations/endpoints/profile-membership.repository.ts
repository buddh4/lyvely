import {
  API_PROFILE_MEMBERSHIP,
  IProfileMembershipClient,
  ProfileMembershipEndpoints,
} from './profile-membership.endpoint';
import { UpdateProfileMembershipSettings } from '../models';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<IProfileMembershipClient>(API_PROFILE_MEMBERSHIP);

export default {
  async update(dto: UpdateProfileMembershipSettings, options?: IProfileApiRequestOptions) {
    return api.post<'update'>(dto, {}, options);
  },

  async updateAvatar(formData: any) {
    return api.post<'updateAvatar'>(ProfileMembershipEndpoints.UPDATE_AVATAR, formData);
  },

  async updateGravatar() {
    return api.post<'updateGravatar'>(ProfileMembershipEndpoints.UPDATE_GAVATAR);
  },
};
