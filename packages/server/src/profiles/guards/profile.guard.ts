import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ProfilesService } from '../services/profiles.service';
import { ProfileRequest } from '../../core/types';
import { isValidObjectId } from '@lyvely/common';
import { UserProfileRelations } from '../models/profile-relations.model';
import { ProfileVisibilityPolicy } from '../policies/profile-visibility.policy';
import { PolicyService } from '../../policies/services/policy.service';
import { ProfileDao } from '../daos/profile.dao';
import { ProfilePermissionsService } from '../../permissions/services/profile-permissions.service';
import { PERMISSIONS_KEY } from '../../permissions/decorators/permissions.decorator';
import { Reflector } from '@nestjs/core';

/**
 * This guard is responsible for setting the `request.profile` and `request.profileRelations` fields for a given profile id.
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
  protected policyService: PolicyService;

  @Inject()
  protected profileService: ProfilesService;

  @Inject()
  protected profileVisibilityPolicy: ProfileVisibilityPolicy;

  @Inject()
  protected profilePermissionService: ProfilePermissionsService;

  @Inject()
  protected profileDao: ProfileDao;

  @Inject()
  protected reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ProfileRequest>();

    if(!isValidObjectId(request.query.pid)) return false;

    const user = request.user;

    if(user) {
      request.profileRelations = await this.profileService.findUserProfileRelations(user, request.query.pid);
      request.profile = request.profileRelations.profile;
    } else {
      request.profile = await this.profileService.findProfileById(request.query.pid);
      request.profileRelations = new UserProfileRelations({ profile: request.profile })
    }

    if(!request.profile) {
      return false;
    }

    if(!await this.policyService.checkEvery(context, this.profileVisibilityPolicy)) {
      return false;
    }

    // TODO: validate profile level features
    return this.validatePermissions(request.profileRelations, context);
  }

  private validatePermissions(profileRelations: UserProfileRelations, context: ExecutionContext) {
    const permissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if(!permissions?.length) {
      return true;
    }

    return this.profilePermissionService.checkEveryPermission(profileRelations, ...permissions);
  }
}
