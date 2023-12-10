import { IProfilePermissionsClient } from './profile-permissions.endpoint';
import { ProfilePermissionSettingModel } from '../models';
import repository from './profile-permissions.repository';
import { unwrapAndTransformResponse } from '@/endpoints';

export class ProfilePermissionsClient implements IProfilePermissionsClient {
  async updateProfilePermission(update: ProfilePermissionSettingModel) {
    return unwrapAndTransformResponse(
      repository.updateProfilePermission(update),
      ProfilePermissionSettingModel,
    );
  }
}
