import { ProfileController, ProfileRoleAccess } from '../decorators';
import {
  API_PROFILE_PERMISSIONS,
  ProfilePermissionsEndpoint,
  ProfileRelationRole,
  ProfilePermissionSettingModel,
} from '@lyvely/interface';
import { ValidBody } from '@/core';
import { Put, Req } from '@nestjs/common';
import { ProtectedProfileRequest } from '@/profiles/types';
import { ProfilePermissionSettingsService } from '@/profiles/services/profile-permission-settings.service';

@ProfileController(API_PROFILE_PERMISSIONS)
@ProfileRoleAccess(ProfileRelationRole.Admin)
export class ProfilePermissionsController implements ProfilePermissionsEndpoint {
  constructor(
    private readonly profilePermissionSettingsService: ProfilePermissionSettingsService
  ) {}

  @Put()
  async updateProfilePermission(
    @ValidBody() update: ProfilePermissionSettingModel,
    @Req() request: ProtectedProfileRequest
  ): Promise<ProfilePermissionSettingModel> {
    const { profile } = request;
    const result = await this.profilePermissionSettingsService.setPermission(profile, update);
    return new ProfilePermissionSettingModel(result);
  }
}
