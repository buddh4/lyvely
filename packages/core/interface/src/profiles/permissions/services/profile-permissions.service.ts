import { AbstractPermissionsService } from '@/permissions/services';
import {
  IProfilePermission,
  IProfilePermissionObject,
  IProfilePermissionSubject,
  profileRelationRoleHierarchy,
} from '../interfaces';
import { useSingleton } from '@lyvely/common';
import { BasePermissionType, getPermission } from '@/permissions';
import { ProfileRelationRole } from '@/profiles/relations';

/**
 * A service for managing profile user permissions.
 */
class ProfilePermissionsService extends AbstractPermissionsService<
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
   * Retrieves the level of a given role or -1 if the role does not exist.
   *
   * @param {ProfileRelationRole} role - The role for which to determine the level.
   * @return {number} The level of the role or -1 if the role does not exist.
   */
  override getRoleLevel(role: ProfileRelationRole): number {
    return profileRelationRoleHierarchy.indexOf(role);
  }
}

/**
 * Returns an instance of the ProfilePermissionsService.
 * The useProfilePermissionsService function utilizes the useSingleton higher-order function
 * to ensure that only one instance of the ProfilePermissionsService is created and shared
 * across multiple components or modules.
 *
 * @returns {ProfilePermissionsService} The instance of ProfilePermissionsService.
 */
export const useProfilePermissionsService = useSingleton(() => new ProfilePermissionsService());
