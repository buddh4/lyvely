import { OptionalUser } from '@/users';
import { ConfigService } from '@nestjs/config';
import { ServerConfiguration } from '@/config';
import { GlobalPermissionRole, useGlobalPermissionsService } from '@lyvely/interface';
import { IGlobalPermissionsService } from '../interfaces';
import { Injectable } from '@nestjs/common';

/**
 * Service for handling global permissions within the application.
 *
 * This service provides methods to verify permissions based on the user's global role,
 * leveraging the application's configuration settings.
 */
@Injectable()
export class GlobalPermissionsService implements IGlobalPermissionsService {
  /**
   * Initializes a new instance of the `GlobalPermissionsService` class.
   *
   * @param configService - The service used to fetch configuration related to permissions and user roles.
   */
  constructor(private readonly configService: ConfigService<ServerConfiguration>) {}

  /**
   * Verifies if a user has all the specified permissions.
   *
   * @param user - The user whose permissions are being checked.
   * @param permissions - The list of permissions to verify against.
   * @returns `true` if the user has every listed permission, otherwise `false`.
   */
  verifyEveryPermission(user: OptionalUser, ...permissions: string[]): boolean {
    if (!permissions?.length) return true;
    return permissions.reduce(
      (result, permissionId) => result && this.verifyPermission(user, permissionId),
      true,
    );
  }

  /**
   * Verifies if a user has any of the specified permissions.
   *
   * @param user - The user whose permissions are being checked.
   * @param permissions - The list of permissions to verify against.
   * @returns `true` if the user has any of the listed permissions, otherwise `false`.
   */
  verifyAnyPermission(user: OptionalUser, ...permissions: string[]): boolean {
    if (!permissions?.length) return true;
    return permissions.reduce(
      (result, permissionId) => result || this.verifyPermission(user, permissionId),
      false,
    );
  }

  /**
   * Checks if a user has a specific global permission.
   *
   * This method uses the `configService` to fetch the permission configuration and then
   * determines if the user has the required permission based on their role and status.
   *
   * @param user - The user whose permission is being checked.
   * @param permissionId - The ID of the permission to verify.
   * @returns `true` if the user has the specified permission, otherwise `false`.
   */
  verifyPermission(user: OptionalUser, permissionId: string): boolean {
    const role = this.getGlobalUserRole(user);
    const config = this.configService.get('permissions', {});
    return useGlobalPermissionsService().verifyPermission(
      permissionId,
      { role, userStatus: user?.status },
      {
        getPermissionSettings: () => [],
        getPermissionGroups: () => [],
      },
      config,
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
    const roleConfig = this.configService.get('userRoles', {});
    return roleConfig[user.id] || GlobalPermissionRole.User;
  }
}
