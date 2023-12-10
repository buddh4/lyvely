import { ConfigService } from '@nestjs/config';
import { ServerConfiguration } from '@/config';
import { Injectable } from '@nestjs/common';
import { Profile, ProfilePermissionSetting } from '../schemas';
import { ProfileContext } from '../models';
import {
  BasePermissionType,
  FieldValidationException,
  getPermission,
  getProfileRoleLevel,
  IProfilePermissionSetting,
  useProfilePermissionsService,
  VisitorMode,
  getProfileRoleLevelByProfileVisibility,
} from '@lyvely/interface';
import { findAndReplace } from '@lyvely/common';
import { assureObjectId } from '@/core';
import { ProfileDao } from '../daos';

/**
 * Service for handling profile level permissions within the application.
 *
 * This service provides methods to verify permissions for on profile level,
 * based on the context, leveraging the application's configuration settings.
 */
@Injectable()
export class ProfilePermissionsService {
  /**
   * Initializes a new instance of the `ProfilePermissionsService` class.
   *
   * @param configService - The service used to fetch configuration related to permissions.
   */
  constructor(
    private readonly profileDao: ProfileDao,
    private readonly configService: ConfigService<ServerConfiguration>,
  ) {}

  /**
   * Sets a permission for a given profile.
   *
   * @param {Profile} profile - The profile to set permissions for.
   * @param {IProfilePermissionSetting} setting - The permission setting to apply.
   * @throws {FieldValidationException} - If the ID is invalid.
   * @returns {Promise<Profile>} - The updated profile with new permissions.
   */
  async setPermission(
    profile: Profile,
    setting: IProfilePermissionSetting<any>,
  ): Promise<ProfilePermissionSetting> {
    const { id, groups } = setting;
    const { role } = setting;

    const permission = getPermission(id, BasePermissionType.Profile);

    if (!permission) {
      throw new FieldValidationException([{ property: 'id', errors: ['invalid'] }]);
    }

    const groupIds = groups
      ?.map((group) => assureObjectId(group))
      .filter((gid) => profile.groups.find((profileGroup) => profileGroup._id.equals(gid)));

    if (getProfileRoleLevel(role) < getProfileRoleLevel(permission.min)) {
      throw new FieldValidationException([{ property: 'role', errors: ['min'] }]);
    }

    const maxLevel = Math.min(
      getProfileRoleLevel(permission.max),
      getProfileRoleLevelByProfileVisibility(profile.visibility),
    );

    if (getProfileRoleLevel(role) > maxLevel) {
      throw new FieldValidationException([{ property: 'role', errors: ['max'] }]);
    }

    const { permissions } = profile;
    const updatedSetting = new ProfilePermissionSetting({ id, groups: groupIds, role });

    findAndReplace(permissions, updatedSetting, 'id', true);

    await this.profileDao.updateOneSetById(profile, { permissions });
    return updatedSetting;
  }

  /**
   * Verifies if the profile context meets all the specified permissions.
   *
   * @param context - The profile context to be evaluated.
   * @param permissions - The list of permissions to verify against.
   * @returns `true` if the profile context meets every listed permission, otherwise `false`.
   */
  verifyEveryPermission(context: ProfileContext, ...permissions: string[]): boolean {
    if (!permissions?.length) return true;
    return permissions.reduce(
      (result, permissionId) => result && this.verifyPermission(context, permissionId),
      true,
    );
  }

  /**
   * Verifies if the profile context meets any of the specified permissions.
   *
   * @param context - The profile context to be evaluated.
   * @param permissions - The list of permissions to verify against.
   * @returns `true` if the profile context meets any of the listed permissions, otherwise `false`.
   */
  verifyAnyPermission(context: ProfileContext, ...permissions: string[]): boolean {
    if (!permissions?.length) return true;
    return permissions.reduce(
      (result, permissionId) => result || this.verifyPermission(context, permissionId),
      false,
    );
  }

  /**
   * Checks if a specific profile context meets a particular permission.
   *
   * This method uses the `configService` to fetch the permission configuration and then
   * determines if the profile context meets the required permission based on various context properties like role, user status, profile settings, and relation status.
   *
   * @param context - The profile context being checked.
   * @param permissionId - The ID of the permission to verify.
   * @returns `true` if the profile context meets the specified permission, otherwise `false`.
   */
  verifyPermission(context: ProfileContext, permissionId: string): boolean {
    if (!context?.profile) return false;

    const { profile, user } = context;
    const role = context.getRole();
    const membership = context.getMembership();
    const config = this.configService.get('permissions', {
      visitorStrategy: { mode: VisitorMode.Disabled },
    });
    return useProfilePermissionsService().verifyPermission(
      permissionId,
      {
        role,
        userStatus: user?.status,
        relationStatus: membership?.relationStatus,
      },
      profile,
      config,
    );
  }
}
