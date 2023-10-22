import { IPermission } from './interfaces/permissions.interface';

/** permission registration **/
const permissions = new Map<string, IPermission<any>>();

/**
 * Registers an array of permissions.
 * @param permissionsToAdd
 */
export function registerPermissions(permissionsToAdd: IPermission<any>[]) {
  permissionsToAdd.forEach((permission) => permissions.set(permission.id, permission));
}

/**
 * Cleans up all registered permissions, can be used to reset permissions in tests.
 */
export function clearPermissions() {
  permissions.clear();
}

/**
 * Searches for a permission by id or instance. In case an instance is given this function assures it is registered.
 * @param permissionOrId permission id or IPermission instance
 */
export function getPermission(permissionOrId: string | IPermission<any>) {
  return permissions.get(typeof permissionOrId === 'string' ? permissionOrId : permissionOrId.id);
}

/**
 * Returns all registered permissions
 */
export function getAllPermissions(): IPermission<any>[] {
  return Array.from(permissions.values());
}
