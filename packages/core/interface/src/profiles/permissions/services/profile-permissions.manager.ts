import {
  IProfilePermission,
  IProfilePermissionObject,
  IProfilePermissionSubject,
  profileRelationRoleHierarchy,
} from '../interfaces';
import { useSingleton } from '@lyvely/common';
import { BasePermissionType, getPermission } from '@/permissions';
import { ProfileRelationRole } from '@/profiles/relations';
import { AbstractProfilePermissionsManager } from './abstract-profile-permissions.manager';

/**
 * A service for managing profile user permissions.
 */
export class ProfilePermissionsManager extends AbstractProfilePermissionsManager<
  IProfilePermission,
  IProfilePermissionSubject,
  IProfilePermissionObject
> {
  /**
   * Retrieves the profile permission based on the provided permission or ID.
   *
   * @param {string | IProfilePermission} permissionOrId - The permission or ID to search for.
   * @return {IProfilePermission | undefined} - The retrieved profile permission.
   */
  override getPermission(
    permissionOrId: string | IProfilePermission,
  ): IProfilePermission | undefined {
    return getPermission<IProfilePermission>(permissionOrId, BasePermissionType.Profile);
  }

  /**
   * Retrieves the role hierarchy, which is an array of roles in which the index defines the role level and lower
   * roles inherit the permissions of higher levels.
   *
   * @returns {ProfileRelationRole[]} An array containing the role hierarchy for the current user.
   */
  override getRoleHierarchy(): ProfileRelationRole[] {
    return profileRelationRoleHierarchy;
  }
}

/**
 * Returns an instance of the ProfilePermissionsManager.
 * The useProfilePermissionsManager function utilizes the useSingleton higher-order function
 * to ensure that only one instance of the ProfilePermissionsService is created and shared
 * across multiple components or modules.
 *
 * @returns {ProfilePermissionsManager} The instance of ProfilePermissionsService.
 */
export const useProfilePermissionsManager = useSingleton(() => new ProfilePermissionsManager());
