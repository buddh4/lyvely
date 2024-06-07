import { ConfigService } from '@nestjs/config';
import { type ConfigurationPath } from '@/config';
import { Injectable } from '@nestjs/common';
import { ProfileContentContext } from '../schemas';
import {
  VisitorMode,
  useContentPermissionsManager,
  IPermission,
  getPermission,
  isGlobalPermission,
  isProfilePermission,
  IntegrityException,
} from '@lyvely/interface';
import { CONFIG_PATH_PERMISSIONS, GlobalPermissionsService } from '@/permissions';
import { ProfilePermissionsService } from '@/profiles';

/**
 * Service for handling content level permissions within the application.
 *
 * This service provides methods to verify permissions of type:
 *
 * - BasePermissionType.Content
 * - BasePermissionType.Profile
 * - BasePermissionType.Global
 */
@Injectable()
export class ContentPermissionsService {
  /**
   * Initializes a new instance of the `ProfilePermissionsService` class.
   *
   * @param configService - The service used to fetch configuration related to permissions.
   * @param globalPermissionsService
   * @param profilePermissionsService
   */
  constructor(
    private readonly configService: ConfigService<ConfigurationPath>,
    private readonly globalPermissionsService: GlobalPermissionsService,
    private readonly profilePermissionsService: ProfilePermissionsService
  ) {}

  /**
   * Verifies if the profile context meets all the specified permissions.
   *
   * @param context - The profile context to be evaluated.
   * @param permissions - The list of permissions to verify against.
   * @returns `true` if the profile context meets every listed permission, otherwise `false`.
   */
  verifyEveryPermission(
    context: ProfileContentContext,
    ...permissions: Array<string | IPermission>
  ): boolean {
    if (!permissions?.length) return true;
    return permissions.reduce(
      (result, permissionId) => result && this.verifyPermission(context, permissionId),
      true
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
    context: ProfileContentContext,
    ...permissions: Array<string | IPermission>
  ): boolean {
    if (!permissions?.length) return true;
    return permissions.reduce(
      (result, permissionOrId) => result || this.verifyPermission(context, permissionOrId),
      false
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
  verifyPermission(context: ProfileContentContext, permissionOrId: string | IPermission): boolean {
    if (!context?.profile) return false;

    const permission = getPermission(permissionOrId);

    if (!permission) throw new IntegrityException(`Permission not registered`);

    if (isGlobalPermission(permission)) {
      return this.globalPermissionsService.verifyPermission(context.user, permission);
    }

    if (isProfilePermission(permission)) {
      return this.profilePermissionsService.verifyPermission(context, permission);
    }

    const { user } = context;
    const role = context.getContentRole();
    const membership = context.getMembership();
    const permissionsConfig = this.configService.get(CONFIG_PATH_PERMISSIONS, {
      visitorStrategy: { mode: VisitorMode.Disabled },
    });

    return useContentPermissionsManager().verifyPermission(
      permission,
      {
        role,
        userStatus: user?.status,
        relationStatus: membership?.relationStatus,
      },
      context,
      {
        ...permissionsConfig,
        featureConfig: this.configService.get('features', {}),
      }
    );
  }
}
