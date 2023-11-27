import {
  GlobalPermissionRole,
  globalPermissionRoleHierarchy,
  IGlobalPermission,
  IGlobalPermissionSubject,
  IPermission,
  IPermissionConfig,
} from '../interfaces';
import { getPermission } from '../permissions.registry';
import { IntegrityException } from '@/exceptions';
import { clamp } from '@lyvely/common';
import { UserStatus } from '@/users';
import { isDefined } from 'class-validator';

/**
 * Verifies if a specific global role is granted a given permission.
 *
 * The verification is based on the hierarchical positioning of the role in the `globalPermissionRoleHierarchy` array.
 *
 * @param permissionOrId - Either a permission ID as a string or an instance of `IGlobalPermission`.
 * @param subject - The subject (e.g. a user)
 * @param config - The global permission config, can be used to overwrite default permissions
 * @returns `true` if the role matches the required permissions, otherwise `false`.
 *
 * @throws {IntegrityException} If there's an inconsistency or missing role in the permission definitions or
 *                              provided role, the function will throw an `IntegrityException`.
 */
export const verifyGlobalPermission = (
  permissionOrId: string | IGlobalPermission,
  subject: IGlobalPermissionSubject,
  config: IPermissionConfig = {},
) => {
  if (!validateVisitorAccess(subject, config)) return false;

  const permission = getGlobalPermission(permissionOrId);

  if (!permission || !subject.role) return false;

  if (!validateUserStatusAccess(permission, subject.userStatus)) return false;

  const configuredSettings = config.defaults?.find((setting) => setting.id === permission.id);

  const settingLevel = globalPermissionRoleHierarchy.indexOf(
    configuredSettings?.role || permission.default,
  );

  return validatePermissionLevel(
    permission,
    settingLevel,
    subject.role,
    globalPermissionRoleHierarchy,
  );
};

export function validatePermissionLevel<TRole>(
  permission: IPermission<TRole>,
  settingLevel: number,
  role: TRole,
  hierarchy: Array<TRole>,
) {
  if (settingLevel === -1) {
    throw new IntegrityException('Can not verify permission against non existing role');
  }

  const minRoleLevel = hierarchy.indexOf(permission.min);
  const maxRoleLevel = hierarchy.indexOf(permission.max);

  if (minRoleLevel === -1 || maxRoleLevel === -1 || maxRoleLevel < minRoleLevel) {
    throw new IntegrityException('Invalid min or max permission definition for ' + permission.id);
  }

  const roleLevel = hierarchy.indexOf(role);

  if (roleLevel === -1) {
    throw new IntegrityException('Invalid role given provided in permission check: ' + role);
  }

  return roleLevel <= clamp(settingLevel, minRoleLevel, maxRoleLevel);
}

export const validateUserStatusAccess = (
  permission: IPermission<any>,
  userStatus: UserStatus | undefined,
) => {
  const userStatusRequirement = permission.userStatuses || [UserStatus.Active];
  return !isDefined(userStatus) || userStatusRequirement.includes(userStatus!);
};

export function validateVisitorAccess<TRole>(role: TRole, config: IPermissionConfig = {}) {
  const allowGuests = config.allowVisitors ?? false;
  return role !== GlobalPermissionRole.Visitor || allowGuests;
}

/**
 * Searches and returns a registered global permission by id or instance.
 * @param permissionOrId
 */
function getGlobalPermission(
  permissionOrId: string | IGlobalPermission,
): IGlobalPermission | undefined {
  const permission = getPermission(permissionOrId);

  // We call getFeature again in case the function was called wit IFeature argument
  if (!permission) {
    console.warn(`Global permission ${permissionOrId} is not registered.`);
    return undefined;
  }

  if (!permission.global) {
    console.warn(`Global permission ${permission.id} can not be verified on global level.`);
    return undefined;
  }

  return permission as IGlobalPermission;
}
