import { AbstractPermissionsService } from './abstract-permissions.service';
import {
  GlobalPermissionRole,
  globalPermissionRoleHierarchy,
  IGlobalPermission,
  IGlobalPermissionObject,
  IGlobalPermissionSubject,
} from '../interfaces';
import { getGlobalPermission } from '../helpers';
import { useSingleton } from '@lyvely/common';

/**
 * Represents the GlobalPermissionsService class which is responsible for managing global user permissions.
 * @extends AbstractPermissionsService<IGlobalPermission, IGlobalPermissionSubject, IGlobalPermissionObject>
 */
class GlobalPermissionsService extends AbstractPermissionsService<
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
    permissionOrId: string | IGlobalPermission,
  ): IGlobalPermission | undefined {
    return getGlobalPermission(permissionOrId);
  }

  /**
   * Returns the permission level of a given role or -1 if the role does not exist.
   *
   * @param {GlobalPermissionRole} role - The role for which to retrieve the level.
   * @return {number} - The level of the role or -1 if the role does not exist.
   */
  override getRoleLevel(role: GlobalPermissionRole): number {
    return globalPermissionRoleHierarchy.indexOf(role);
  }
}

export const useGlobalPermissionsService = useSingleton(() => new GlobalPermissionsService());
