import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import {
  getPermissionsFromContext,
  getAnyPermissionsFromContext,
  GlobalPermissionsService,
} from '@/permissions';
import { Reflector } from '@nestjs/core';
import { ProfilePermissionsService } from '../services';
import { ProfileRequest } from '../types';
import { getPermission } from '@lyvely/interface';
import { IntegrityException } from '@lyvely/common';
import { ProfileContext } from '../models';
import { User } from '@/users';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  protected reflector: Reflector;

  @Inject()
  private globalPermissionsService: GlobalPermissionsService;

  @Inject()
  private profilePermissionsService: ProfilePermissionsService;

  canActivate(context: ExecutionContext): boolean {
    const permissionIds = getPermissionsFromContext(context, this.reflector);
    const request = context.switchToHttp().getRequest<ProfileRequest>();

    const { context: profileContext, user } = request;

    if (!permissionIds?.length) return true;

    return (
      this.verifyEach(profileContext, user, getPermissionsFromContext(context, this.reflector)) &&
      this.verifyAny(profileContext, user, getAnyPermissionsFromContext(context, this.reflector))
    );
  }

  private verifyEach(context: ProfileContext, user: User | undefined, permissionIds: string[]) {
    if (!permissionIds?.length) return true;
    return permissionIds.reduce(
      (result, permissionId) => result && this.verifyPermission(context, user, permissionId),
      true,
    );
  }

  private verifyAny(context: ProfileContext, user: User | undefined, permissionIds: string[]) {
    if (!permissionIds?.length) return true;
    return permissionIds.reduce(
      (result, permissionId) => result || this.verifyPermission(context, user, permissionId),
      false,
    );
  }

  private verifyPermission(context: ProfileContext, user: User | undefined, permissionId: string) {
    const permission = getPermission(permissionId);
    if (!permission) throw new IntegrityException('Could not find permission ' + permissionId);
    return permission.global
      ? this.globalPermissionsService.verifyPermission(context.user, permission.id)
      : this.profilePermissionsService.verifyPermission(context, permission.id);
  }
}
