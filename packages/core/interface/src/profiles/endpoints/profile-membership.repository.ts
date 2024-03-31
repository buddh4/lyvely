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
    return api.put<'update'>(dto, {}, options);
  },

  async updateAvatar(formData: any) {
    return api.put<'updateAvatar'>(ProfileMembershipEndpoints.UPDATE_AVATAR, formData);
  },

  async updateGravatar() {
    return api.put<'updateGravatar'>(ProfileMembershipEndpoints.UPDATE_GAVATAR);
  },

  async revoke() {
    return api.delete<'revoke'>(ProfileMembershipEndpoints.REVOKE);
  },
};
