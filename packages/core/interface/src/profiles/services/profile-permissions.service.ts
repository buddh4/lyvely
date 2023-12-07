import { AbstractPermissionsService } from '@/permissions/services';
import {
  IProfilePermission,
  IProfilePermissionObject,
  IProfilePermissionSubject,
  ProfileRelationRole,
  profileRelationRoleHierarchy,
} from '../interfaces';
import { getProfilePermission } from '@/profiles';
import { UserStatus } from '@/users';
import { useSingleton } from '@lyvely/common';

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
    return getProfilePermission(permissionOrId);
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

  /**
   * Verifies the user status against the permission and subject or status.
   *
   * If a role is not associated with a status e.g. in case of a visitor role, this function
   * assumes an active status by default.
   *
   * @param {TPermission} permission - The permission object.
   * @param {TSubject | UserStatus} subjectOrStatus - The subject or user status.
   * @protected
   * @returns {boolean} - Returns true if the user status meets the requirement, otherwise returns false.
   */
  protected override verifyUserStatus(
    permission: IProfilePermission,
    subjectOrStatus?: IProfilePermissionSubject | UserStatus,
  ): boolean {
    if (!subjectOrStatus) return true;

    if (typeof subjectOrStatus === 'number') {
      return super.verifyUserStatus(permission, subjectOrStatus);
    }

    return (
      super.verifyUserStatus(permission, subjectOrStatus.userStatus) &&
      super.verifyUserStatus(permission, subjectOrStatus.relationStatus)
    );
  }
}

export const useProfilePermissionsService = useSingleton(() => new ProfilePermissionsService());
