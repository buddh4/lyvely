import {
  IProfilePermission,
  profileRelationRoleHierarchy,
  ProfileRelationRole,
  RoleVisibilityLevel,
  ProfileVisibilityLevel,
} from '../interfaces';
import { IntegrityException } from '@/exceptions';
import { BasePermissionType, IPermission } from '@/permissions';

/**
 * Returns the profile visibility level for a given role.
 * @param role
 */
export function getProfileRoleLevel(role: ProfileRelationRole) {
  // Just to make sure no invalid role is given
  role ??= ProfileRelationRole.Visitor;
  const roleLevel = profileRelationRoleHierarchy.indexOf(role);
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
export function getProfileRoleLevelByProfileVisibility(visibility: ProfileVisibilityLevel): number {
  switch (visibility) {
    case ProfileVisibilityLevel.Member:
      // Guest is a special kind of member
      return getProfileRoleLevel(ProfileRelationRole.Guest);
    case ProfileVisibilityLevel.Organization:
      return getProfileRoleLevel(ProfileRelationRole.Organization);
    case ProfileVisibilityLevel.Follower:
      return getProfileRoleLevel(ProfileRelationRole.Follower);
    case ProfileVisibilityLevel.User:
      return getProfileRoleLevel(ProfileRelationRole.User);
    case ProfileVisibilityLevel.Visitor:
      return getProfileRoleLevel(ProfileRelationRole.Visitor);
    default:
      throw new IntegrityException(`Invalid profile visibility level: ${visibility}`);
  }
}

/**
 * Returns the role level associated with the given role visibility level.
 *
 * @param {ProfileVisibilityLevel} visibility - The profile visibility level.
 * @returns {number} - The role level associated with the profile visibility.
 * @throws {IntegrityException} - If the given profile visibility level is invalid.
 */
export function getProfileRoleLevelByRoleVisibility(visibility: RoleVisibilityLevel): number {
  switch (visibility) {
    case RoleVisibilityLevel.Owner:
      return getProfileRoleLevel(ProfileRelationRole.Owner);
    case RoleVisibilityLevel.Admin:
      return getProfileRoleLevel(ProfileRelationRole.Admin);
    case RoleVisibilityLevel.Moderator:
      return getProfileRoleLevel(ProfileRelationRole.Moderator);
    case RoleVisibilityLevel.Member:
      return getProfileRoleLevel(ProfileRelationRole.Member);
    case RoleVisibilityLevel.Guest:
      return getProfileRoleLevel(ProfileRelationRole.Guest);
    case RoleVisibilityLevel.Organization:
      return getProfileRoleLevel(ProfileRelationRole.Organization);
    case RoleVisibilityLevel.User:
      return getProfileRoleLevel(ProfileRelationRole.User);
    case RoleVisibilityLevel.Visitor:
      return getProfileRoleLevel(ProfileRelationRole.Visitor);
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
export function verifyProfileRoleLevel(
  userRole: ProfileRelationRole,
  minRole: ProfileRelationRole
) {
  return getProfileRoleLevel(userRole) <= getProfileRoleLevel(minRole);
}

/**
 * Verifies if a userRole has a role level equal to or lower than the specified minRole.
 *
 * @param {ProfileRelationRole} userRole - The user's current role.
 * @param {ProfileVisibilityLevel} visibility - The profile visibility role.
 *
 * @return {boolean} - True if the userRole has a role level equal to or lower than the minRole, otherwise false.
 */
export function verifyProfileVisibilityLevel(
  userRole: ProfileRelationRole,
  visibility: ProfileVisibilityLevel
) {
  return getProfileRoleLevel(userRole) <= getProfileRoleLevelByProfileVisibility(visibility);
}

/**
 * Checks if a given permission is a profile permission.
 *
 * @param {IPermission<any, any>} permission - The permission to check.
 * @return {boolean} - True if the permission is a profile permission, false otherwise.
 */
export function isProfilePermission(
  permission: IPermission<any, any>
): permission is IProfilePermission {
  return permission.type === BasePermissionType.Profile;
}
