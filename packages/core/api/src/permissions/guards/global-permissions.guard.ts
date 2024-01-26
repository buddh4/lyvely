import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OptionalUserRequest } from '@/users';
import { GlobalPermissionsService } from '../services';
import { META_PERMISSIONS_SOME, META_PERMISSIONS_STRICT } from '@/profiles/profiles.constants';

/**
 * Guards against unauthorized access based on global permissions supporting the @Permissions and @StrictPermissions
 * decorator.
 */
export class GlobalPermissionsGuard implements CanActivate {
  @Inject()
  protected reflector: Reflector;

  @Inject()
  private readonly globalPermissionsService: GlobalPermissionsService;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<OptionalUserRequest>();
    const strictPermissions = this.getStrictPermissionsFromContext(context);
    const permissions = this.getPermissionsFromContext(context);

    return (
      this.globalPermissionsService.verifyAnyPermission(request.user, ...permissions) &&
      this.globalPermissionsService.verifyEveryPermission(request.user, ...strictPermissions)
    );
  }

  private getStrictPermissionsFromContext(context: ExecutionContext) {
    return (
      this.reflector.getAllAndMerge<string[]>(META_PERMISSIONS_STRICT, [
        context.getHandler(),
        context.getClass(),
      ]) || []
    );
  }

  private getPermissionsFromContext(context: ExecutionContext) {
    return (
      this.reflector.getAllAndMerge<string[]>(META_PERMISSIONS_SOME, [
        context.getHandler(),
        context.getClass(),
      ]) || []
    );
  }
}
