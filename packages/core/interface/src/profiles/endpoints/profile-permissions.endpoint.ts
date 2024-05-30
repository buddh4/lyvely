import { profileApiPrefix, StrictEndpoint } from '@/endpoints';
import { ProfilePermissionSettingModel } from '../models';

export interface IProfilePermissionsClient {
  updateProfilePermission(
    update: ProfilePermissionSettingModel
  ): Promise<ProfilePermissionSettingModel>;
}

export type ProfilePermissionsEndpoint = StrictEndpoint<IProfilePermissionsClient>;

export const API_PROFILE_PERMISSIONS = profileApiPrefix('permissions');
