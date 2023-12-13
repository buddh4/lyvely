import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ProfilesService, ProfilePermissionsService } from '../services';
import { ProfileRequest } from '../types';
import { isValidObjectId } from '@lyvely/common';
import { verifyProfileRoleLevel } from '@lyvely/interface';
import { ProfileVisibilityPolicy } from '../policies';
import { ProfileDao } from '../daos';
import { Reflector } from '@nestjs/core';
import { InjectPolicy } from '@/policies';
import { ProfileContext } from '../models';
import { getProfileRoleFromContext } from '../decorators/profile.role-level.decorator';

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

    const oid = isValidObjectId(request.query.oid) ? request.query.oid : undefined;
    const user = request.user;

    // TODO: Request query pid is used for compatibility with pre alpha version. Can be removed as soon as all clients are merged.
    const pid = request.params.pid || request.query.pid;
    if (isValidObjectId(pid)) {
      request.context = await this.profileService.findProfileContext(user, pid, oid);
      request.profile = request.context.profile;
    }

    const handle = request.params.handle || request.query.handle;
    if (!request.profile && typeof handle === 'string') {
      request.context = await this.profileService.findProfileContextByHandle(user, handle);
      request.profile = request.context.profile;
    }

    if (!request.profile) return false;

    return (
      this.verifyProfileRoleLevel(request.context, context) &&
      this.profileVisibilityPolicy.verify(request.context)
    );
  }

  private verifyProfileRoleLevel(profileContext: ProfileContext, context: ExecutionContext) {
    const roleRestriction = getProfileRoleFromContext(context, this.reflector);
    if (!roleRestriction) return true;
    return verifyProfileRoleLevel(profileContext.getRole(), roleRestriction);
  }
}
