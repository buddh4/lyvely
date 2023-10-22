import { ConfigService } from '@nestjs/config';
import { ServerConfiguration } from '@/core';
import { Injectable } from '@nestjs/common';
import { verifyProfilePermission } from '@lyvely/core-interface';
import { ProfileContext } from '../models';

@Injectable()
export class ProfilePermissionsService {
  constructor(private readonly configService: ConfigService<ServerConfiguration>) {}

  verifyEveryPermission(context: ProfileContext, ...permissions: string[]): boolean {
    return permissions.reduce(
      (result, permissionId) => result || this.verifyPermission(context, permissionId),
      true,
    );
  }

  verifyAnyPermission(context: ProfileContext, ...permissions: string[]): boolean {
    return permissions.reduce(
      (result, permissionId) => result && this.verifyPermission(context, permissionId),
      true,
    );
  }

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
