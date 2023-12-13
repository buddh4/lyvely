import { contentRoleHierarchy, ContentUserRole, IContentPermission } from '../interfaces';
import { ProfileVisibilityLevel } from '@/profiles';
import { IntegrityException } from '@/exceptions';
import { BasePermissionType, IPermission } from '@/permissions';

/**
 * Returns the profile visibility level for a given role.
 * @param role
 */
export function getContentUserRoleLevel(role: ContentUserRole) {
  const roleLevel = contentRoleHierarchy.indexOf(role);
  if (roleLevel < 0) throw new IntegrityException(`Invalid content user role level ${role}`);
  return roleLevel;
}

/**
 * Returns the role level associated with the given profile visibility.
 *
 * @param {ProfileVisibilityLevel} visibility - The profile visibility level.
 * @returns {number} - The role level associated with the profile visibility.
 * @throws {IntegrityException} - If the given profile visibility level is invalid.
 */
export function getContentUserRoleLevelByProfileVisibility(
  visibility: ProfileVisibilityLevel,
): number {
  switch (visibility) {
    case ProfileVisibilityLevel.Member:
      // Guest is a special kind of member
      return getContentUserRoleLevel(ContentUserRole.Guest);
    case ProfileVisibilityLevel.Organization:
      return getContentUserRoleLevel(ContentUserRole.Organization);
    case ProfileVisibilityLevel.Follower:
      return getContentUserRoleLevel(ContentUserRole.Follower);
    case ProfileVisibilityLevel.User:
      return getContentUserRoleLevel(ContentUserRole.User);
    case ProfileVisibilityLevel.Visitor:
      return getContentUserRoleLevel(ContentUserRole.Visitor);
    default:
      throw new IntegrityException(`Invalid profile visibility level: ${visibility}`);
  }
}

/**
 * Verifies if a userRole has a role level equal to or lower than the specified minRole.
 *
 * @param {ProfileRelationRole} userRole - The user's current role.
 * @param {ProfileRelationRole} minRole - The minimum role required.
 *
 * @return {boolean} - True if the userRole has a role level equal to or lower than the minRole, otherwise false.
 */
export function verifyContentRoleLevel(userRole: ContentUserRole, minRole: ContentUserRole) {
  return getContentUserRoleLevel(userRole) <= getContentUserRoleLevel(minRole);
}

/**
 * Checks if the given permission is a content permission.
 *
 * @param {IPermission<any, any>} permission - The permission to check.
 * @return {boolean} - Returns true if the permission is a content permission, otherwise returns false.
 */
export function isContentPermission(
  permission: IPermission<any, any>,
): permission is IContentPermission {
  return permission.type === BasePermissionType.Content;
}
