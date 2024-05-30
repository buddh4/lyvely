import { AbstractPermissionsManager } from '@/permissions/services';
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
}

export const useUserRelationPermissionsManager = useSingleton(() => new UserPermissionsManager());
