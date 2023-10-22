import {
  profileRelationRoleHierarchy,
  IProfilePermission,
  IProfilePermissionSubject,
  ProfileRelationRole,
} from '../interfaces';
import {
  getPermission,
  IPermissionConfig,
  validatePermissionLevel,
  validateUserStatusAccess,
  validateVisitorAccess,
} from '@/permissions';
import { IntegrityException } from '@lyvely/common';

/**
 * Verifies if a specific role is granted a given permission.
 *
 * The verification is based on the hierarchical positioning of the role in the `profileRelationRoleHierarchy` array.
 *
 * @param permissionOrId - Either a permission ID as a string or an instance of `IProfilePermission`.
 * @param subject - The permission subject we want to test against
 * @param config - Global configuration, which can be used to overwrite permission defaults
 *
 * @returns `true` if the role matches the required permissions, otherwise `false`.
 *
 * @throws {IntegrityException} If there's an inconsistency or missing role in the permission definitions or
 *                              provided profile role, the function will throw an `IntegrityException`.
 */
export const verifyProfilePermission = (
  permissionOrId: string | IProfilePermission,
  subject: IProfilePermissionSubject,
  config: IPermissionConfig = {},
) => {
  if (!validateVisitorAccess(subject.role, config)) return false;

  const permission = getProfilePermission(permissionOrId);

  if (!permission || !subject.role) return false;

  if (!validateUserStatusAccess(permission, subject.userStatus)) return false;
  if (!validateUserStatusAccess(permission, subject.relationStatus)) return false;

  const profileSettings = subject.settings?.find((setting) => setting.id === permission.id);
  const configuredSettings = config.defaults?.find((setting) => setting.id === permission.id);

  const settingLevel = profileRelationRoleHierarchy.indexOf(
    profileSettings?.role || configuredSettings?.role || permission.default,
  );

  return validatePermissionLevel(
    permission,
    settingLevel,
    subject.role,
    profileRelationRoleHierarchy,
  );
};

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

  if (permission.global) {
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
