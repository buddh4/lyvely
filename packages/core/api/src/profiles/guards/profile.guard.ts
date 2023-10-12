import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ProfilesService, ProfilePermissionsService } from '../services';
import { ProfileRequest } from '../types';
import { isValidObjectId } from '@lyvely/common';
import { ProfileContext } from '../models';
import { ProfileVisibilityPolicy } from '../policies';
import { ProfileDao } from '../daos';
import { Reflector } from '@nestjs/core';
import { InjectPolicy } from '@/policies';

export const PROFILE_PERMISSIONS_KEY_STRICT = 'profile_permissions_strict';
export const PROFILE_PERMISSIONS_KEY_SOME = 'profile_permissions_some';

/**
 * This guard is responsible for setting the `request.profile` and `request.context` fields for a given profile id.
 * The profile id needs to be provided as request query param with the name `pid` and requires a valid ObjectId string.
 *
 * This guard expects an AuthGuard to set the user beforehand, otherwise this guard will assume the user is a guest user.
 *
 * Furthermore, this guard validates the following policies for the given user:
 *
 *  - `ProfileVisibilityPolicy`
 *  - `ProfilePermissionPolicyPolicy`
 */
@Injectable()
export class ProfileGuard implements CanActivate {
  @Inject()
  protected profileService: ProfilesService;

  @InjectPolicy(ProfileVisibilityPolicy.name)
  protected profileVisibilityPolicy: ProfileVisibilityPolicy;

  @Inject()
  protected profilePermissionService: ProfilePermissionsService;

  @Inject()
  protected profileDao: ProfileDao;

  @Inject()
  protected reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ProfileRequest>();

    if (!isValidObjectId(request.query.pid)) return false;

    const oid = isValidObjectId(request.query.oid) ? request.query.oid : undefined;
    const user = request.user;

    request.context = await this.profileService.findProfileContext(user, request.query.pid, oid);
    request.profile = request.context.profile;

    if (!request.profile) return false;

    if (!(await this.profileVisibilityPolicy.verify(request.context))) {
      return false;
    }

    return this.validatePermissions(request.context, context);
  }

  private validatePermissions(profileContext: ProfileContext, context: ExecutionContext) {
    const strictPermissions = this.getPermissionsFromContext(
      context,
      PROFILE_PERMISSIONS_KEY_STRICT,
    );

    if (strictPermissions?.length) {
      return this.profilePermissionService.checkEveryPermission(
        profileContext,
        ...strictPermissions,
      );
    }

    const anyPermissions = this.getPermissionsFromContext(context, PROFILE_PERMISSIONS_KEY_SOME);

    return anyPermissions?.length
      ? this.profilePermissionService.checkSomePermission(profileContext, ...anyPermissions)
      : true;
  }

  private getPermissionsFromContext(context: ExecutionContext, key: string) {
    return this.reflector.getAllAndOverride<string[]>(key, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
