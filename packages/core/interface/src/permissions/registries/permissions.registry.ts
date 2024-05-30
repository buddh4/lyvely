import { IPermission } from '../interfaces/permissions.interface';

/** permission registration **/
const permissions = new Map<string, IPermission<any, any>>();

/**
 * Registers an array of permissions.
 * @param permissionsToAdd
 */
export function registerPermissions(permissionsToAdd: IPermission<any, any>[]) {
  permissionsToAdd.forEach((permission) => permissions.set(permission.id, permission));
}

/**
 * Cleans up all registered permissions, can be used to reset permissions in tests.
 */
export function clearPermissions() {
  permissions.clear();
}

/**
 * Retrieves a permission based on the provided permission ID or permission object.
 *
 * @param {string | IPermission<any, any>} permissionOrId - The ID of the permission to retrieve or the permission object itself.
 * @param {string} [type] - Optional. The type of permission to filter by.
 *
 * @return {TPermission | undefined} The retrieved permission object if found, undefined otherwise.
 */
export function getPermission<TPermission extends IPermission<any, any> = IPermission<any, any>>(
  permissionOrId: string | IPermission<any, any>,
  type?: string
): TPermission | undefined {
  const permission = permissions.get(
    typeof permissionOrId === 'string' ? permissionOrId : permissionOrId.id
  );

  if (permission && type) return permission.type === type ? <TPermission>permission : undefined;

  return permission as TPermission;
}

/**
 * Retrieves all permissions or filtered permissions of a given type sorted by module id.
 *
 * @param {string} [type] - Optional. The type of permissions to retrieve. If provided, only permissions of this type will be returned.
 *
 * @returns {TPermission[]} - An array of permissions that match the specified type, or all permissions if no type is provided.
 */
export function getAllPermissions<
  TPermission extends IPermission<any, any> = IPermission<any, any>,
>(type?: string): TPermission[] {
  let result = Array.from(permissions.values()) as TPermission[];
  result = type ? result.filter((p) => p.type === type) : result;
  result.sort((a, b) => (a.moduleId > b.moduleId ? 1 : -1));
  return result;
}
