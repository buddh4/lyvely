import {
  AbstractPermissionsManager,
  IPermission,
  IPermissionConfig,
  IPermissionSubject,
} from '@/permissions';
import {
  IProfilePermissionObject,
  ProfileRelationRole,
  ProfileVisibilityLevel,
} from '../interfaces';
import { VisitorMode } from '@/users';

/**
 * A service for managing profile user permissions.
 */
export abstract class AbstractProfilePermissionsManager<
  TPermission extends IPermission<any, any>,
  TSubject extends IPermissionSubject<TPermission['min']>,
  TObject extends IProfilePermissionObject<TPermission['min']>,
  TConfig extends IPermissionConfig = IPermissionConfig,
> extends AbstractPermissionsManager<TPermission, TSubject, TObject, TConfig> {
  /**
   * Checks the validity of the given role level against the permission object and config and returns a replacement
   * in case the check fails.
   *
   * @param {number} roleLevel - The current role level.
   * @param {TObject} object - The object containing profile permission data.
   * @param {TConfig} config - The configuration object.
   * @return {number} - The valid role level.
   */
  override getValidRoleLevel(
    permission: TPermission,
    object: TObject,
    config: TConfig,
    roleLevel: number,
  ): number {
    roleLevel = super.getValidRoleLevel(permission, object, config, roleLevel);

    const { visibility, hasOrg } = object.getProfilePermissionData();
    const role = super.getRoleByLevel(roleLevel);
    if (role === ProfileRelationRole.Organization && !hasOrg)
      return this.getRoleLevel(ProfileRelationRole.Guest);
    if (
      role === ProfileRelationRole.Organization &&
      visibility < ProfileVisibilityLevel.Organization
    ) {
      return this.getRoleLevel(ProfileRelationRole.Member);
    }
    if (role === ProfileRelationRole.Follower && visibility < ProfileVisibilityLevel.Follower) {
      return this.getRoleLevel(ProfileRelationRole.Member);
    }
    if (role === ProfileRelationRole.User && visibility < ProfileVisibilityLevel.User) {
      return this.getRoleLevel(ProfileRelationRole.Member);
    }
    if (role === ProfileRelationRole.Visitor && visibility < ProfileVisibilityLevel.Visitor) {
      return this.getRoleLevel(ProfileRelationRole.Member);
    }
    if (
      role === ProfileRelationRole.Visitor &&
      config.visitorStrategy.mode !== VisitorMode.Enabled
    ) {
      return this.getRoleLevel(ProfileRelationRole.User);
    }

    return roleLevel;
  }
}
