import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ProfileRequest } from '../types';
import { ProfileContext } from '../models';
import { BaseProfileGuard } from './base-profile.guard';
import { ProfilePermissionsService } from '../services';
import { META_PERMISSIONS_SOME, META_PERMISSIONS_STRICT } from '../profiles.constants';

/**
 * Represents a guard for profile context access.
 *
 * This guard will try to extract a profile id from the request usually by :pid parameter and then will add the
 * ProfileContext to the request object.
 *
 * This guard also includes a check for the @ProfileRoleLevel decorator as well as a profile visibility check.
 *
 * This guard furthermore includes a profile permission checks supporting the @Permissions and @StrictPermissions decorators
 * with global and profile level permissions.
 */
@Injectable()
export class ProfileGuard extends BaseProfileGuard implements CanActivate {
  @Inject()
  protected profilePermissionService: ProfilePermissionsService;

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!(await super.canActivate(context))) return false;

    const request = context.switchToHttp().getRequest<ProfileRequest>();
    return this.verifyPermissions(request.context, context);
  }

  verifyPermissions(contentContext: ProfileContext, context: ExecutionContext) {
    const strictPermissions = this.getStrictPermissionsFromContext(context);
    const permissions = this.getPermissionsFromContext(context);

    return (
      this.profilePermissionService.verifyAnyPermission(contentContext, ...permissions) &&
      this.profilePermissionService.verifyEveryPermission(contentContext, ...strictPermissions)
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
