import { AbstractPermissionsService } from '@/permissions/services';
import {
  IUserRelationPermission,
  IUserRelationPermissionObject,
  IUserRelationPermissionSubject,
  UserRelationRole,
  userRelationRoleHierarchy,
} from '../interfaces';
import { useSingleton } from '@lyvely/common';
import { BasePermissionType, getPermission } from '@/permissions';

/**
 * A service for managing user relation permissions.
 */
class UserPermissionsService extends AbstractPermissionsService<
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
    permissionOrId: string | IUserRelationPermission,
  ): IUserRelationPermission | undefined {
    return getPermission<IUserRelationPermission>(permissionOrId, BasePermissionType.User);
  }

  /**
   * Retrieves the level of a given role or -1 if the role does not exist.
   *
   * @param {ProfileRelationRole} role - The role for which to determine the level.
   * @return {number} The level of the role or -1 if the role does not exist.
   */
  override getRoleLevel(role: UserRelationRole): number {
    return userRelationRoleHierarchy.indexOf(role);
  }
}

export const useUserRelationPermissionsService = useSingleton(() => new UserPermissionsService());
