import { IProfilePermissionsClient } from './profile-permissions.endpoint';
import { ProfilePermissionSettingModel } from '../models';
import repository from './profile-permissions.repository';
import { unwrapAndTransformResponse } from '@/endpoints';
import { useSingleton } from '@lyvely/common';

export class ProfilePermissionsClient implements IProfilePermissionsClient {
  async updateProfilePermission(
    update: ProfilePermissionSettingModel,
  ): Promise<ProfilePermissionSettingModel> {
    return unwrapAndTransformResponse(
      repository.updateProfilePermission(update),
      ProfilePermissionSettingModel,
    );
  }
}

export const useProfilePermissionsClient = useSingleton(() => new ProfilePermissionsClient());
