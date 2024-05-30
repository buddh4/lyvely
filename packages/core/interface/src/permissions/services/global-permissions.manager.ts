import { AbstractPermissionsManager } from './abstract-permissions.manager';
import {
  BasePermissionType,
  GlobalPermissionRole,
  globalPermissionRoleHierarchy,
  IGlobalPermission,
  IGlobalPermissionObject,
  IGlobalPermissionSubject,
} from '../interfaces';
import { useSingleton } from '@lyvely/common';
import { getPermission } from '../registries';

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
   * @returns {GlobalPermissionRole[]} An array containing the role hierarchy for the current user.
   */
  override getRoleHierarchy(): GlobalPermissionRole[] {
    return globalPermissionRoleHierarchy;
  }
}

export const useGlobalPermissionsManager = useSingleton(() => new GlobalPermissionsManager());
