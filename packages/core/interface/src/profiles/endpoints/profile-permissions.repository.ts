import { useApi } from '@/repository';
import { API_PROFILE_PERMISSIONS, IProfilePermissionsClient } from './profile-permissions.endpoint';
import { ProfilePermissionSettingModel } from '../models';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

const api = useApi<IProfilePermissionsClient>(API_PROFILE_PERMISSIONS);

export default {
  async updateProfilePermission(update: ProfilePermissionSettingModel) {
    return api.put<'updateProfilePermission'>(update);
  },
};
