import { OptionalUser } from '@/users';
import {
  IGlobalPermission,
  useGlobalPermissionsManager,
  VisitorMode,
  getUserRole,
} from '@lyvely/interface';
import { Injectable } from '@nestjs/common';
import { LyvelyConfigService } from '@/config';
import type { PermissionConfig } from '@/permissions/interfaces';

/**
 * Service for handling global permissions within the application.
 *
 * This service provides methods to verify permissions of type:
 *
 * - BasePermissionType.Profile
 */
@Injectable()
export class GlobalPermissionsService {
  /**
   * Initializes a new instance of the `GlobalPermissionsService` class.
   *
   * @param configService - The service used to fetch configuration related to permissions and user roles.
   */
  constructor(private readonly configService: LyvelyConfigService<PermissionConfig>) {}

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
    const permissionsConfig = this.configService.getModuleConfig('permissions', {
      visitorStrategy: { mode: VisitorMode.Disabled },
    });
    return useGlobalPermissionsManager().verifyPermission(
      permissionOrId,
      { role: getUserRole(user), userStatus: user?.status },
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
}
