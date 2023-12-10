import { profileRelationRoleHierarchy } from '../interfaces';
import { ProfileRelationRole } from '@/profiles/relations';
import { ProfileVisibilityLevel } from '@/profiles';
import { IntegrityException } from '@/exceptions';

/**
 * Returns the profile visibility level for a given role.
 * @param role
 */
export function getProfileRoleLevel(role: ProfileRelationRole) {
  return profileRelationRoleHierarchy.indexOf(role);
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
 * Verifies if a userRole has a role level equal to or lower than the specified minRole.
 *
 * @param {ProfileRelationRole} userRole - The user's current role.
 * @param {ProfileRelationRole} minRole - The minimum role required.
 *
 * @return {boolean} - True if the userRole has a role level equal to or lower than the minRole, otherwise false.
 */
export function verifyRoleLevel(userRole: ProfileRelationRole, minRole: ProfileRelationRole) {
  return getProfileRoleLevel(userRole) <= getProfileRoleLevel(minRole);
}
