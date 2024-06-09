import { AbstractPermissionsManager } from './abstract-permissions.manager';
import {
  BasePermissionType,
  IGlobalPermission,
  IGlobalPermissionObject,
  IGlobalPermissionSubject,
  type IPermissionManagerConfig,
} from '../interfaces';
import { useSingleton } from '@lyvely/common';
import { getPermission } from '../registries';
import { isEnabledGlobalFeature } from '@/features';
import { UserRole, userRoleHierarchy } from '../interfaces';

/**
 * Represents the GlobalPermissionsService class which is responsible for managing global user permissions.
 * @extends AbstractPermissionsService<IGlobalPermission, IGlobalPermissionSubject, IGlobalPermissionObject>
 */
class GlobalPermissionsManager extends AbstractPermissionsManager<
  IGlobalPermission,
  IGlobalPermissionSubject,
  IGlobalPermissionObject
> {
  /**
   * Retrieves the global permission object based on the provided permission or permission ID.
   *
   * @param {string | IGlobalPermission} permissionOrId - The permission name or the permission ID.
   *
   * @return {IGlobalPermission | undefined} - The global permission object if found, or undefined if not found.
   */
  override getPermission(
    permissionOrId: string | IGlobalPermission
  ): IGlobalPermission | undefined {
    return getPermission(permissionOrId, BasePermissionType.Global);
  }

  /**
   * Retrieves the role hierarchy, which is an array of roles in which the index defines the role level and lower
   * roles inherit the permissions of higher levels.
   *
   * @returns {UserRole[]} An array containing the role hierarchy for the current user.
   */
  override getRoleHierarchy(): UserRole[] {
    return userRoleHierarchy;
  }

  /**
   * Verifies if a given  permission related global feature is enabled.
   *
   * @param {IGlobalPermission} permission - The permission to verify.
   * @param config
   * @protected
   * @returns {boolean} - True if the user has the permission for the object, otherwise false.
   */
  protected override verifyPermissionFeature(
    permission: IGlobalPermission,
    config: IPermissionManagerConfig
  ): boolean {
    if (!permission.feature) return true;
    return isEnabledGlobalFeature(permission.feature, config.featureConfig);
  }
}

export const useGlobalPermissionsManager = useSingleton(() => new GlobalPermissionsManager());
