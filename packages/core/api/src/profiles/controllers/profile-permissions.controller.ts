import { ProfileController } from '@/common';
import {
  API_PROFILE_PERMISSIONS,
  ProfilePermissionsEndpoint,
  ProfileRelationRole,
  ProfilePermissionSettingModel,
} from '@lyvely/interface';
import { UseClassSerializer } from '@/core';
import { Put } from '@nestjs/common';
import { ProfileRoleLevel } from '../decorators';
import { ProfilePermissionsService } from '@/profiles';

@ProfileController(API_PROFILE_PERMISSIONS)
@UseClassSerializer()
@ProfileRoleLevel(ProfileRelationRole.Admin)
export class ProfilePermissionsController implements ProfilePermissionsEndpoint {
  constructor(private readonly profilePermissionsService: ProfilePermissionsService) {}

  @Put()
  async updateProfilePermission(
    update: ProfilePermissionSettingModel,
  ): Promise<ProfilePermissionSettingModel> {
    const result = await this.profilePermissionsService.setPermission(update);
    return new ProfilePermissionSettingModel(result);
  }
}
