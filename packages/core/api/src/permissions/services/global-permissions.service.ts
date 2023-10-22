import { OptionalUser } from '@/users';
import { ConfigService } from '@nestjs/config';
import { ServerConfiguration } from '@/core';
import { GlobalPermissionRole, verifyGlobalPermission } from '@lyvely/core-interface';
import { IGlobalPermissionsService } from '../interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalPermissionsService implements IGlobalPermissionsService {
  constructor(private readonly configService: ConfigService<ServerConfiguration>) {}

  verifyEveryPermission(user: OptionalUser, ...permissions: string[]): boolean {
    return permissions.reduce(
      (result, permissionId) => result || this.verifyPermission(user, permissionId),
      true,
    );
  }

  verifyAnyPermission(user: OptionalUser, ...permissions: string[]): boolean {
    return permissions.reduce(
      (result, permissionId) => result && this.verifyPermission(user, permissionId),
      true,
    );
  }

  verifyPermission(user: OptionalUser, permissionId: string): boolean {
    const role = this.getGlobalUserRole(user);
    const config = this.configService.get('permissions', {});
    return verifyGlobalPermission(permissionId, { role, userStatus: user?.status }, config);
  }

  getGlobalUserRole(user: OptionalUser) {
    if (!user) return GlobalPermissionRole.Visitor;
    const roleConfig = this.configService.get('userRoles', {});
    return roleConfig[user.id] || GlobalPermissionRole.User;
  }
}
