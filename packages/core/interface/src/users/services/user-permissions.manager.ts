import { AbstractPermissionsManager } from '@/permissions/services';
import {
  IUserRelationPermission,
  IUserRelationPermissionObject,
  IUserRelationPermissionSubject,
  UserRelationRole,
  userRelationRoleHierarchy,
} from '../interfaces';
import { useSingleton } from '@lyvely/common';
import { BasePermissionType, getPermission, type IPermissionManagerConfig } from '@/permissions';
import { isEnabledGlobalFeature } from '@/features';

/**
 * A service for managing user relation permissions.
 */
export class UserPermissionsManager extends AbstractPermissionsManager<
  IUserRelationPermission,
  IUserRelationPermissionSubject,
  IUserRelationPermissionObject
> {
  /**
   * Retrieves the user relation permission based on the provided permission or ID.
   *
   * @param {string | IProfilePermission} permissionOrId - The permission or ID to search for.
   * @return {IProfilePermission | undefined} - The retrieved profile permission.
   */
  override getPermission(
    permissionOrId: string | IUserRelationPermission
  ): IUserRelationPermission | undefined {
    return getPermission<IUserRelationPermission>(permissionOrId, BasePermissionType.User);
  }
  /**
   * Retrieves the role hierarchy, which is an array of roles in which the index defines the role level and lower
   * roles inherit the permissions of higher levels.
   *
   * @returns {UserRelationRole[]} An array containing the role hierarchy for the current user.
   */
  override getRoleHierarchy(): UserRelationRole[] {
    return userRelationRoleHierarchy;
  }

  /**
   * Verifies if a given permission related feature is enabled.
   *
   * @param {IUserRelationPermission} permission - The permission to verify.
   * @param {IPermissionConfig} config - The configuration for permission checking.
   *
   * @protected
   * @return {boolean} - Returns true if the permission is allowed for the object,
   *                    false otherwise.
   *
   * @throws {Error} - This method is not implemented.
   */
  protected override verifyPermissionFeature(
    permission: IUserRelationPermission,
    config: IPermissionManagerConfig
  ): boolean {
    if (!permission.feature) return true;
    return isEnabledGlobalFeature(permission.feature, config.featureConfig);
  }
}

export const useUserRelationPermissionsManager = useSingleton(() => new UserPermissionsManager());
