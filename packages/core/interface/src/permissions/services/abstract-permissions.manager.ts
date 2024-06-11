import {
  BasePermissionRole,
  IPermission,
  type IPermissionManagerConfig,
  IPermissionObject,
  IPermissionsService,
  IPermissionSubject,
} from '../interfaces';
import { UserStatus } from '@/users/interfaces/user-status.enum';
import { VisitorMode } from '@/permissions/interfaces/visitor-strategy.interface';
import { IntegrityException } from '@/exceptions';
import { isDefined } from 'class-validator';
import { clamp, hasIntersection } from '@lyvely/common';

/**
 * AbstractPermissionsService is an abstract class that provides common functionality for permission services.
 * Concrete permission service classes should extend this class and implement the required methods.
 *
 * A permission
 *
 * @typeparam TPermission - The type of permission object.
 * @typeparam TSubject - The type of permission subject.
 * @typeparam TObject - The type of object the permission is being requested for.
 * @typeparam TConfig - The type of permission configuration.
 * @typeparam TRole - The type of permission role.
 *
 * @implements IPermissionsService<TPermission, TSubject, TObject, TConfig>
 */
export abstract class AbstractPermissionsManager<
  TPermission extends IPermission<any, any>,
  TSubject extends IPermissionSubject<TPermission['min']>,
  TObject extends IPermissionObject<TPermission['min']>,
  TConfig extends IPermissionManagerConfig = IPermissionManagerConfig,
  TRole = TPermission['min'],
> implements IPermissionsService<TPermission, TSubject, TObject, TConfig>
{
  /**
   * Retrieves the permission object associated with the given permission or ID and assures the permission is actually
   * registered.
   *
   * @param {TPermission | string} permissionOrId - The permission or ID for which the permission object will be retrieved.
   * @return {TPermission} - The permission object associated with the given permission or ID.
   */
  abstract getPermission(permissionOrId: TPermission | string): TPermission | undefined;

  /**
   * Retrieves the role hierarchy, which is an array of roles in which the index defines the role level and lower
   * roles inherit the permissions of higher levels.
   *
   * @returns {TRole[]} An array containing the role hierarchy for the current user.
   */
  abstract getRoleHierarchy(): TRole[];

  /**
   * Retrieves the permission role level associated with a given role.
   *
   * If the given role does not exist this function must return -1.
   *
   * @param {TRole} role - The role to retrieve the level for.
   * @return {number} - The level associated with the role.
   */
  public getRoleLevel(role: TRole) {
    return this.getRoleHierarchy().indexOf(role);
  }

  /**
   * Retrieves the role based on the given level.
   *
   * @param {number} level - The level at which the role is located in the hierarchy.
   * @returns {string} - The role corresponding to the given level.
   */
  public getRoleByLevel(level: number) {
    return this.getRoleHierarchy()[level];
  }

  /**
   * Verify each permission or permission ID against a subject, object, and config.
   *
   * @param {Array<TPermission | string>} permissionOrIds - Array of permissions or permission IDs to verify.
   * @param {TSubject} subject - Subject to perform the verification against.
   * @param {TObject} object - Object to perform the verification against.
   * @param {TConfig} config - Configuration for the verification.
   *
   * @returns {boolean} - True if all permissions or permission IDs pass the verification, false otherwise.
   */
  public verifyEach(
    permissionOrIds: Array<TPermission | string>,
    subject: TSubject,
    object: TObject,
    config: TConfig
  ) {
    if (!permissionOrIds?.length) return true;
    return permissionOrIds.reduce(
      (result, permissionId) =>
        result && this.verifyPermission(permissionId, subject, object, config),
      true
    );
  }

  /**
   * Verifies if any of the given permissions or permission ids are valid for the specified subject and object.
   *
   * @param {Array<TPermission | string>} permissionOrIds - An array of permissions or permission ids to verify.
   * @param {TSubject} subject - The subject to verify the permissions against.
   * @param {TObject} object - The object to verify the permissions against.
   * @param {TConfig} config - Additional configuration options.
   * @returns {boolean} - Returns true if any of the permissions or permission ids are valid, false otherwise.
   * @private
   */
  public verifyAny(
    permissionOrIds: Array<TPermission | string>,
    subject: TSubject,
    object: TObject,
    config: TConfig
  ) {
    if (!permissionOrIds?.length) return true;
    return permissionOrIds.reduce(
      (result, permissionId) =>
        result || this.verifyPermission(permissionId, subject, object, config),
      false
    );
  }

  /**
   * Verifies the permission for a given subject and object
   *
   * @param {TPermission | string} permissionOrId - The permission or ID to verify
   * @param {TSubject} subject - The subject requesting the permission
   * @param {TObject} object - The object the permission is being requested for
   * @param {TConfig} config - Additional configuration for the permission verification
   *
   * @return {boolean} - Returns true if the permission is verified, else false
   */
  public verifyPermission(
    permissionOrId: TPermission | string,
    subject: TSubject,
    object: TObject,
    config: TConfig
  ): boolean {
    return this._verifyPermission(permissionOrId, subject, object, config);
  }

  /**
   * Verifies a permission against a subject and object.
   *
   * @param {TPermission | string} permissionOrId - The permission or permission ID to verify.
   * @param {TSubject} subject - The subject to verify against.
   * @param {TObject} object - The object to verify against.
   * @param {TConfig} config - The configuration for permission verification.
   * @param {Set<string>} [checkedPermissions=new Set()] - A set of already verified permissions to check for circular dependencies.
   * @returns {boolean} - Returns true if the permission is verified, otherwise returns false.
   * @private
   */
  private _verifyPermission(
    permissionOrId: TPermission | string,
    subject: TSubject,
    object: TObject,
    config: TConfig,
    checkedPermissions: Set<string> = new Set()
  ): boolean {
    // We need a permission role
    if (!subject.role) return false;

    // Do not allow visitor access if visitor access is disabled
    if (!this.verifyVisitorAccess(subject, config)) return false;

    // The permission needs to be registered.
    const permission = this.getPermission(permissionOrId);

    if (!permission) {
      const permissionId = typeof permissionOrId === 'string' ? permissionOrId : permissionOrId.id;
      throw new IntegrityException(`Permission ${permissionId} not registered`);
    }

    if (permission.feature && !this.verifyPermissionFeature(permission, config, object))
      return false;

    this.checkCircularDependency(permissionOrId, checkedPermissions);

    if (!this.verifyUserStatus(permission, subject)) return false;

    if (!this.verifyDependencies(permission, subject, object, config, checkedPermissions)) {
      return false;
    }

    if (this.verifyPermissionGroup(permission, subject, object, config)) return true;

    return this.verifyPermissionLevel(permission, subject, object, config);
  }

  /**
   * Verifies if the configured feature is enabled in the permission context.
   * @param permission
   * @param config
   * @param object
   * @protected
   */
  protected abstract verifyPermissionFeature(
    permission: TPermission,
    config: TConfig,
    object: TObject
  ): boolean;

  /**
   * Checks for circular dependency in permissions.
   *
   * @param {TPermission|string} permissionOrId - The permission or permission ID to check for circular dependency.
   * @param {Set<string>} checkedPermissions - A set of checked permissions to track circular dependencies.
   * @private
   */
  private checkCircularDependency(
    permissionOrId: TPermission | string,
    checkedPermissions: Set<string>
  ) {
    const permissionId = typeof permissionOrId === 'string' ? permissionOrId : permissionOrId.id;
    if (checkedPermissions.has(permissionId)) {
      throw new IntegrityException(`Detected circular dependency for permission ${permissionId}`);
    }

    checkedPermissions.add(permissionId);
  }

  /**
   * Verifies visitor access for a given subject and configuration.
   *
   * @param {TSubject} subject - The subject to check for access.
   * @param {TConfig} config - The configuration used to determine the access rules.
   * @protected
   * @returns {boolean} - True if the subject has access as a visitor, false otherwise.
   */
  protected verifyVisitorAccess(subject: TSubject, config: TConfig) {
    const allowGuests = config?.visitorStrategy?.mode === VisitorMode.Enabled;
    return subject.role !== BasePermissionRole.Visitor || allowGuests;
  }

  /**
   * Verifies dependencies for a given permission.
   *
   * @param {TPermission} permission - The permission to verify dependencies for.
   * @param {TSubject} subject - The subject to check permissions against.
   * @param {TObject} object - The object the permission is applied to.
   * @param {TConfig} config - The configuration to use for permission verification.
   * @param {Set<string>} checkedPermissions - Set of already checked permissions.
   * @returns {boolean} - Returns true if all dependencies are satisfied, false otherwise.
   * @private
   */
  private verifyDependencies(
    permission: TPermission,
    subject: TSubject,
    object: TObject,
    config: TConfig,
    checkedPermissions: Set<string>
  ) {
    if (!permission.dependencies?.length) return true;

    for (const dependencyId of permission.dependencies) {
      if (!this._verifyPermission(dependencyId, subject, object, config, checkedPermissions)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Verifies the user status against the permission and subject or status.
   *
   * If a role is not associated with a status e.g. in case of a visitor role, this function
   * assumes an active status by default.
   *
   * @param {TPermission} permission - The permission object.
   * @param {TSubject} subjectOrStatus - The subject or user status.
   * @protected
   * @returns {boolean} - Returns true if the user status meets the requirement, otherwise returns false.
   */
  protected verifyUserStatus(permission: TPermission, subject: TSubject): boolean {
    return (
      this._verifyUserStatus(permission, subject.userStatus) &&
      this._verifyUserStatus(permission, subject.relationStatus)
    );
  }

  /**
   * Verifies if the user status meets the required permission.
   *
   * @param {TPermission} permission - The permission object to check against.
   * @param {UserStatus} [userStatus] - The user's current status.
   * @private
   *
   * @return {boolean} - Returns true if the user status meets the permission requirements, false otherwise.
   */
  private _verifyUserStatus(permission: TPermission, userStatus?: UserStatus) {
    // If the role is not associated with a status we assume its active by default e.g. visitors.
    if (!userStatus) return true;
    const userStatusRequirement = permission.userStatuses || [UserStatus.Active];
    return !isDefined(userStatus) || userStatusRequirement.includes(userStatus!);
  }

  /**
   * Verifies if a given permission level is valid for the provided subject and configuration.
   *
   * @param {TPermission} permission - The permission to verify.
   * @param {TSubject} subject - The subject for which the permission is being verified.
   * @param {TObject} object - The object to which the permission belongs.
   * @param {TConfig} config - The configuration used for the permission verification.
   *
   * @protected
   *
   * @returns {boolean} - True if the permission level is valid, false otherwise.
   *
   * @throws {IntegrityException} - If the permission level or configuration is invalid.
   */
  protected verifyPermissionLevel(
    permission: TPermission,
    subject: TSubject,
    object: TObject,
    config: TConfig
  ) {
    const roleLevel = this.getRoleLevel(subject.role);

    if (roleLevel === -1) {
      throw new IntegrityException(
        'Invalid role given provided in permission check: ' + subject.role
      );
    }

    return roleLevel <= this.getActiveRoleLevel(permission, object, config);
  }

  /**
   * Retrieves the active role level for a given permission, by respecting the configuration and settings as well as
   * min/max restrictions.
   *
   * @param {TPermission} permission - The permission to check the role level for.
   * @param {TObject} object - The object to check the role level against.
   * @param {TConfig} config - The configuration to determine the active role level.
   * @returns {number} - The active role level for the specified permission, object, and configuration.
   * @throws {IntegrityException} - If the configured role level is -1 (non-existent role),
   * or if the min or max permission definition is invalid.
   */
  public getActiveRoleLevel(permission: TPermission, object: TObject, config: TConfig) {
    const configuredLevel = this.getConfiguredRoleLevel(permission, object, config);
    return this.getValidRoleLevel(permission, object, config, configuredLevel);
  }

  /**
   * Checks the validity of the given role level against the permission object and config and returns a
   * downgraded role level if required.
   *
   * @param {number} roleLevel - The current role level.
   * @param {TObject} object - The object containing profile permission data.
   * @param {TConfig} config - The configuration object.
   * @return {number} - The valid role level.
   */
  getValidRoleLevel(
    permission: TPermission,
    object: TObject,
    config: TConfig,
    roleLevel: number
  ): number {
    if (roleLevel === -1) {
      throw new IntegrityException('Can not verify permission against non existing role');
    }

    const minRoleLevel = this.getRoleLevel(permission.min);
    const maxRoleLevel = this.getRoleLevel(permission.max);

    if (minRoleLevel === -1 || maxRoleLevel === -1 || maxRoleLevel < minRoleLevel) {
      throw new IntegrityException('Invalid min or max permission definition for ' + permission.id);
    }

    return clamp(roleLevel, minRoleLevel, maxRoleLevel);
  }

  /**
   * Retrieves the active role for a given permission, by respecting the configuration and settings as well as
   * min/max restrictions.
   *
   * @param {TPermission} permission - The permission to check.
   * @param {TObject} object - The object to check against.
   * @param {TConfig} config - The configuration to use.
   * @return {TRole} - The active role.
   */
  public getActiveRole(permission: TPermission, object: TObject, config: TConfig) {
    return this.getRoleByLevel(this.getActiveRoleLevel(permission, object, config));
  }

  /**
   * Retrieves the configured role based on the given permission and configuration and settings.
   *
   * This function first checks if there are permission related settings available on the permission object
   * and if not falls back to the configured permission settings if any. If no settings and no configuration was
   * found related to the permission we return use the default role configured.
   *
   * Note: This function does not check if the configured role is within the min/max restrictions of the permission.
   *
   * @param {TPermission} permission - The permission object.
   * @param {TObject} object - The object to which the permission belongs.
   * @param {TConfig} config - The configuration object.
   * @private
   * @returns {number} The configured role level.
   */
  private getConfiguredRoleLevel(
    permission: TPermission,
    object: TObject,
    config: TConfig
  ): number {
    const permissionSettings = this.getPermissionSettings(permission, object);
    const permissionConfig = this.getPermissionConfig(permission, config);
    return this.getRoleLevel(
      permissionSettings?.role || permissionConfig?.role || permission.default
    );
  }

  /**
   * Returns the permission settings for a given permission and object.
   *
   * @param {TPermission} permission - The permission to get the settings for.
   * @param {TObject} object - The object to get the settings from.
   * @returns {object|null} - The permission settings for the given permission and object, or null if no settings are found.
   */
  private getPermissionSettings(permission: TPermission, object: TObject) {
    return object.getPermissionSettings().find((setting) => setting.id === permission.id);
  }

  /**
   * Retrieves the permission configuration from the given config object.
   *
   * @param {TPermission} permission - The permission object.
   * @param {TConfig} config - The config object containing the permission settings.
   * @returns {object | undefined} The permission configuration if found, or undefined if not found.
   * @private
   */
  private getPermissionConfig(permission: TPermission, config: TConfig) {
    return config.defaults?.find((setting) => setting.id === permission.id);
  }

  /**
   * Verify if a subject belongs to any of the permission groups specified in the permission settings or configuration.
   *
   * @param {TPermission} permission - The permission being checked.
   * @param {TSubject} subject - The subject being checked.
   * @param {TObject} object - The object being checked.
   * @param {TConfig} config - The configuration being used for checking permissions.
   * @returns {boolean} - True if the subject belongs to any of the permission groups, otherwise false.
   * @private
   */
  private verifyPermissionGroup(
    permission: TPermission,
    subject: TSubject,
    object: TObject,
    config: TConfig
  ): boolean {
    if (!subject.groups?.length) return false;
    const permissionSettings = this.getPermissionSettings(permission, object);

    const allowedGroups = object.getPermissionGroups();
    const subjectGroups = subject.groups.filter((g) => allowedGroups.includes(g));

    if (permissionSettings?.groups?.length) {
      const settingGroups = permissionSettings.groups.filter((g) => allowedGroups.includes(g));
      return hasIntersection(settingGroups, subjectGroups);
    }

    const permissionConfig = this.getPermissionConfig(permission, config);
    if (permissionConfig?.groups?.length) {
      const configGroups = permissionConfig.groups.filter((g) => allowedGroups.includes(g));
      return hasIntersection(configGroups, subjectGroups);
    }

    return false;
  }
}
