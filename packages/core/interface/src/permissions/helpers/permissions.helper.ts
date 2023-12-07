import { BasePermissionType, IGlobalPermission } from '../interfaces';
import { getPermission } from '../permissions.registry';

/**
 * Searches and returns a registered global permission by id or instance.
 *
 * @param {string | IGlobalPermission} permissionOrId - The ID or instance of the global permission.
 *
 * @return {IGlobalPermission | undefined} - The registered global permission if found, otherwise undefined.
 */
export function getGlobalPermission(
  permissionOrId: string | IGlobalPermission,
): IGlobalPermission | undefined {
  const permission = getPermission(permissionOrId);

  // We call getFeature again in case the function was called wit IFeature argument
  if (!permission) {
    console.warn(`Global permission ${permissionOrId} is not registered.`);
    return undefined;
  }

  if (permission.type !== BasePermissionType.Global) {
    console.warn(`Global permission ${permission.id} can not be verified on global level.`);
    return undefined;
  }

  return permission as IGlobalPermission;
}
