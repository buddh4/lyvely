import { ConfigService } from '@nestjs/config';
import { ServerConfiguration } from '@/config';
import { Injectable } from '@nestjs/common';
import { ProfileContext } from '../models';
import {
  getPermission,
  useProfilePermissionsManager,
  VisitorMode,
  IProfilePermission,
  IGlobalPermission,
  isGlobalPermission,
  IntegrityException,
} from '@lyvely/interface';
import { GlobalPermissionsService } from '@/permissions';

/**
 * Service for handling profile level permissions within the application.
 *
 * This service provides methods to verify permissions of type:
 *
 * - BasePermissionType.Profile
 * - BasePermissionType.Global
 */
@Injectable()
export class ProfilePermissionsService {
  /**
   * Initializes a new instance of the `ProfilePermissionsService` class.
   *
   * @param configService - The service used to fetch configuration related to permissions.
   */
  constructor(
    private readonly configService: ConfigService<ServerConfiguration>,
    private readonly globalPermissionsService: GlobalPermissionsService,
  ) {}

  /**
   * Verifies if the profile context meets all the specified permissions.
   *
   * @param context - The profile context to be evaluated.
   * @param permissions - The list of permissions to verify against.
   * @returns `true` if the profile context meets every listed permission, otherwise `false`.
   */
  verifyEveryPermission(
    context: ProfileContext,
    ...permissions: Array<string | IProfilePermission | IGlobalPermission>
  ): boolean {
    if (!permissions?.length) return true;
    return permissions.reduce(
      (result, permissionId) => result && this.verifyPermission(context, permissionId),
      true,
    );
  }

  /**
   * Verifies if the profile context meets any of the specified permissions.
   *
   * @param context - The profile context to be evaluated.
   * @param permissions - The list of permissions to verify against.
   * @returns `true` if the profile context meets any of the listed permissions, otherwise `false`.
   */
  verifyAnyPermission(
    context: ProfileContext,
    ...permissions: Array<string | IProfilePermission | IGlobalPermission>
  ): boolean {
    if (!permissions?.length) return true;
    return permissions.reduce(
      (result, permissionId) => result || this.verifyPermission(context, permissionId),
      false,
    );
  }

  /**
   * Checks if a specific profile context meets a particular permission.
   *
   * This method uses the `configService` to fetch the permission configuration and then
   * determines if the profile context meets the required permission based on various context properties like role, user status, profile settings, and relation status.
   *
   * @param context - The profile context being checked.
   * @param permissionOrId
   * @returns `true` if the profile context meets the specified permission, otherwise `false`.
   */
  verifyPermission(
    context: ProfileContext,
    permissionOrId: string | IProfilePermission | IGlobalPermission,
  ): boolean {
    if (!context?.profile) return false;

    const permission = getPermission(permissionOrId);

    if (!permission) throw new IntegrityException(`Permission not registered`);

    if (isGlobalPermission(permission)) {
      return this.globalPermissionsService.verifyPermission(context.user, permission);
    }

    const { profile, user } = context;
    const role = context.getRole();
    const membership = context.getMembership();
    const config = this.configService.get('permissions', {
      visitorStrategy: { mode: VisitorMode.Disabled },
    });
    return useProfilePermissionsManager().verifyPermission(
      permission,
      {
        role,
        userStatus: user?.status,
        relationStatus: membership?.relationStatus,
      },
      profile,
      config,
    );
  }
}
