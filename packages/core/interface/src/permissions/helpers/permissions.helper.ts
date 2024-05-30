import { BasePermissionType, IGlobalPermission, IPermission } from '../interfaces';

/**
 * Checks if the given permission is a global permission.
 *
 * @param {IPermission<any, any>} permission - The permission to check.
 * @return {boolean} - Returns true if the permission is a content permission, otherwise returns false.
 */
export function isGlobalPermission(
  permission: IPermission<any, any>
): permission is IGlobalPermission {
  return permission.type === BasePermissionType.Global;
}
