import { useSingleton } from '@lyvely/common';
import { BasePermissionType, getPermission } from '@/permissions';
import {
  contentRoleHierarchy,
  ContentUserRole,
  IContentPermission,
  IContentPermissionObject,
  IContentPermissionSubject,
} from '../interfaces';
import { AbstractProfilePermissionsManager } from '@/profiles';

/**
 * A service for managing content user permissions.
 */
export class ContentPermissionsManager extends AbstractProfilePermissionsManager<
  IContentPermission,
  IContentPermissionSubject,
  IContentPermissionObject
> {
  /**
   * Retrieves the content permission based on the provided permission or ID.
   *
   * @param {string | IContentPermission} permissionOrId - The permission or ID to search for.
   * @return {IContentPermission | undefined} - The retrieved profile permission.
   */
  override getPermission(
    permissionOrId: string | IContentPermission,
  ): IContentPermission | undefined {
    return getPermission<IContentPermission>(permissionOrId, BasePermissionType.Content);
  }

  /**
   * Retrieves the role hierarchy, which is an array of roles in which the index defines the role level and lower
   * roles inherit the permissions of higher levels.
   *
   * @returns {ContentUserRole[]} An array containing the role hierarchy for the current user.
   */
  override getRoleHierarchy(): ContentUserRole[] {
    return contentRoleHierarchy;
  }
}

/**
 * Returns an instance of the ContentPermissionsManager.
 * The useProfilePermissionsManager function utilizes the useSingleton higher-order function
 * to ensure that only one instance of the ProfilePermissionsService is created and shared
 * across multiple components or modules.
 *
 * @returns {ContentPermissionsManager} The instance of ProfilePermissionsService.
 */
export const useContentPermissionsManager = useSingleton(() => new ContentPermissionsManager());
