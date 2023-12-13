import { Injectable } from '@nestjs/common';
import { Profile, ProfilePermissionSetting } from '../schemas';
import {
  BasePermissionType,
  FieldValidationException,
  getPermission,
  getProfileRoleLevel,
  IProfilePermissionSetting,
  getProfileRoleLevelByProfileVisibility,
  ProfileRelationRole,
  IProfilePermission,
  isProfilePermission,
  ContentUserRole,
  getContentUserRoleLevel,
  IContentPermission,
  getContentUserRoleLevelByProfileVisibility,
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
export class ProfilePermissionSettingsService {
  /**
   * Initializes a new instance of the `ProfilePermissionsService` class.
   *
   * @param configService - The service used to fetch configuration related to permissions.
   */
  constructor(private readonly profileDao: ProfileDao) {}

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

    // Translate ObjectId group ids to string ids used by the permission interface.
    const groupIds = groups
      ?.map((group) => assureObjectId(group))
      .filter((gid) => profile.groups.find((profileGroup) => profileGroup._id.equals(gid)));

    this.validatePermissionSetting(profile, setting, permission);

    const { permissions } = profile;
    const updatedSetting = new ProfilePermissionSetting({ id, groups: groupIds, role });

    findAndReplace(permissions, updatedSetting, 'id', true);

    await this.profileDao.updateOneSetById(profile, { permissions });
    return updatedSetting;
  }

  /**
   * Validates the permission setting with the given profile.
   *
   * @param {Profile} profile - The profile to validate against.
   * @param {IProfilePermissionSetting<any>} setting - The permission setting to validate.
   * @param {any} permission - The permission to validate.
   * @private
   */
  public validatePermissionSetting(
    profile: Profile,
    setting: IProfilePermissionSetting<any>,
    permission: any,
  ) {
    if (isProfilePermission(permission)) {
      this.validateProfileSetting(profile, setting.role as ProfileRelationRole, permission);
    } else {
      this.validateContentSetting(profile, setting.role as ContentUserRole, permission);
    }
  }

  /**
   * Validates a profile setting based on the provided role and permission.
   *
   * @param {Profile} profile - The profile to validate.
   * @param {ProfileRelationRole} role - The role of the profile.
   * @param {IProfilePermission} permission - The permission to validate against.
   * @throws {FieldValidationException} When the validation fails.
   * @private
   */
  private validateProfileSetting(
    profile: Profile,
    role: ProfileRelationRole,
    permission: IProfilePermission,
  ) {
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
  }

  /**
   * Validates the content setting based on the provided profile, role, and permission.
   * @param profile {Profile} - The profile of the user.
   * @param role {ContentUserRole} - The role of the user for the content.
   * @param permission {IContentPermission} - The permission level required for the content.
   * @throws {FieldValidationException} - If the role does not meet the minimum permission level
   *                                     or exceeds the maximum permission level.
   * @private
   */
  private validateContentSetting(
    profile: Profile,
    role: ContentUserRole,
    permission: IContentPermission,
  ) {
    if (getContentUserRoleLevel(role) < getContentUserRoleLevel(permission.min)) {
      throw new FieldValidationException([{ property: 'role', errors: ['min'] }]);
    }

    const maxLevel = Math.min(
      getContentUserRoleLevel(permission.max),
      getContentUserRoleLevelByProfileVisibility(profile.visibility),
    );

    if (getContentUserRoleLevel(role) > maxLevel) {
      throw new FieldValidationException([{ property: 'role', errors: ['max'] }]);
    }
  }
}
