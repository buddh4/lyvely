import {
  profileRelationRoleHierarchy,
  IProfilePermission,
  ProfileRelationRole,
} from '../interfaces';
import { BasePermissionType, getPermission } from '@/permissions';
/**
 * Searches and returns a registered profile permission by id or instance.
 * @param permissionOrId
 */
export function getProfilePermission(
  permissionOrId: string | IProfilePermission,
): IProfilePermission | undefined {
  const permission = getPermission(permissionOrId);

  // We call getFeature again in case the function was called wit IFeature argument
  if (!permission) {
    console.warn(`Profile ${permissionOrId} is not registered.`);
    return undefined;
  }

  if (permission.type !== BasePermissionType.Profile) {
    console.warn(`Global permission ${permission.id} can not be verified on profile level.`);
    return undefined;
  }

  return permission as IProfilePermission;
}

/**
 * Returns the profile visibility level for a given role.
 * @param role
 */
export function getProfileRoleVisibilityLevel(role: ProfileRelationRole) {
  return profileRelationRoleHierarchy.indexOf(role);
}
