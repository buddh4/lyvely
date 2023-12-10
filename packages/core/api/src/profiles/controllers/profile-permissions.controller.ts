import { ProfileController, ProfileRoleLevel } from '../decorators';
import {
  API_PROFILE_PERMISSIONS,
  ProfilePermissionsEndpoint,
  ProfileRelationRole,
  ProfilePermissionSettingModel,
} from '@lyvely/interface';
import { UseClassSerializer } from '@/core';
import { Put, Body, Req } from '@nestjs/common';
import { ProfilePermissionsService, ProtectedProfileRequest } from '@/profiles';

@ProfileController(API_PROFILE_PERMISSIONS)
@UseClassSerializer()
@ProfileRoleLevel(ProfileRelationRole.Admin)
export class ProfilePermissionsController implements ProfilePermissionsEndpoint {
  constructor(private readonly profilePermissionsService: ProfilePermissionsService) {}

  @Put()
  async updateProfilePermission(
    @Body() update: ProfilePermissionSettingModel,
    @Req() request: ProtectedProfileRequest,
  ): Promise<ProfilePermissionSettingModel> {
    const { profile } = request;
    const result = await this.profilePermissionsService.setPermission(profile, update);
    return new ProfilePermissionSettingModel(result);
  }
}
