import { OptionalUser } from '@/users';
import { ConfigService } from '@nestjs/config';
import { type ConfigurationPath } from '@/config';
import {
  GlobalPermissionRole,
  IGlobalPermission,
  useGlobalPermissionsManager,
  VisitorMode,
} from '@lyvely/interface';
import { IGlobalPermissionsService } from '../interfaces';
import { Injectable } from '@nestjs/common';
import { CONFIG_PATH_PERMISSIONS } from '@/permissions/permissions.constants';

/**
 * Service for handling global permissions within the application.
 *
 * This service provides methods to verify permissions of type:
 *
 * - BasePermissionType.Profile
 */
@Injectable()
export class GlobalPermissionsService implements IGlobalPermissionsService {
  /**
   * Initializes a new instance of the `GlobalPermissionsService` class.
   *
   * @param configService - The service used to fetch configuration related to permissions and user roles.
   */
  constructor(private readonly configService: ConfigService<ConfigurationPath>) {}

  /**
   * Verifies if a user has all the specified permissions.
   *
   * @param user - The user whose permissions are being checked.
   * @param permissions - The list of permissions to verify against.
   * @returns `true` if the user has every listed permission, otherwise `false`.
   */
  verifyEveryPermission(
    user: OptionalUser,
    ...permissions: Array<string | IGlobalPermission>
  ): boolean {
    if (!permissions?.length) return true;
    return permissions.reduce(
      (result, permissionId) => result && this.verifyPermission(user, permissionId),
      true
    );
  }

  /**
   * Verifies if a user has any of the specified permissions.
   *
   * @param user - The user whose permissions are being checked.
   * @param permissions - The list of permissions to verify against.
   * @returns `true` if the user has any of the listed permissions, otherwise `false`.
   */
  verifyAnyPermission(
    user: OptionalUser,
    ...permissions: Array<string | IGlobalPermission>
  ): boolean {
    if (!permissions?.length) return true;
    return permissions.reduce(
      (result, permissionId) => result || this.verifyPermission(user, permissionId),
      false
    );
  }

  /**
   * Checks if a user has a specific global permission.
   *
   * This method uses the `configService` to fetch the permission configuration and then
   * determines if the user has the required permission based on their role and status.
   *
   * @param user - The user whose permission is being checked.
   * @param permissionOrId
   * @returns `true` if the user has the specified permission, otherwise `false`.
   */
  verifyPermission(user: OptionalUser, permissionOrId: string | IGlobalPermission): boolean {
    const role = this.getGlobalUserRole(user);
    const permissionsConfig = this.configService.get(CONFIG_PATH_PERMISSIONS, {
      visitorStrategy: { mode: VisitorMode.Disabled },
    });
    return useGlobalPermissionsManager().verifyPermission(
      permissionOrId,
      { role, userStatus: user?.status },
      {
        getPermissionSettings: () => [],
        getPermissionGroups: () => [],
      },
      {
        ...permissionsConfig,
        featureConfig: this.configService.get('features', {}),
      }
    );
  }

  /**
   * Fetches the global user role for the given user.
   *
   * If the user is not provided we assume a visitor role, if no role is configured the default User role is returned.
   *
   * @param user - The user whose global role is being determined.
   * @returns The global role of the user or a default role if not specified.
   */
  getGlobalUserRole(user: OptionalUser) {
    if (!user) return GlobalPermissionRole.Visitor;
    return user.role || GlobalPermissionRole.User;
  }
}
