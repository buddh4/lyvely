import { ConfigService } from '@nestjs/config';
import { ServerConfiguration } from '@/core';
import { Injectable } from '@nestjs/common';
import { verifyProfilePermission } from '@lyvely/core-interface';
import { ProfileContext } from '../models';

/**
 * Service for handling profile level permissions within the application.
 *
 * This service provides methods to verify permissions for on profile level,
 * based on the context, leveraging the application's configuration settings.
 */
@Injectable()
export class ProfilePermissionsService {
  /**
   * Initializes a new instance of the `ProfilePermissionsService` class.
   *
   * @param configService - The service used to fetch configuration related to permissions.
   */
  constructor(private readonly configService: ConfigService<ServerConfiguration>) {}

  /**
   * Verifies if the profile context meets all the specified permissions.
   *
   * @param context - The profile context to be evaluated.
   * @param permissions - The list of permissions to verify against.
   * @returns `true` if the profile context meets every listed permission, otherwise `false`.
   */
  verifyEveryPermission(context: ProfileContext, ...permissions: string[]): boolean {
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
  verifyAnyPermission(context: ProfileContext, ...permissions: string[]): boolean {
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
   * @param permissionId - The ID of the permission to verify.
   * @returns `true` if the profile context meets the specified permission, otherwise `false`.
   */
  verifyPermission(context: ProfileContext, permissionId: string): boolean {
    if (!context?.profile) return false;

    const { profile, user } = context;
    const role = context.getRole();
    const membership = context.getMembership();
    const config = this.configService.get('permissions', {});
    return verifyProfilePermission(
      permissionId,
      {
        role,
        userStatus: user?.status,
        settings: profile.permissions,
        relationStatus: membership?.relationStatus,
      },
      config,
    );
  }
}
