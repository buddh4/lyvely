import { Injectable } from '@nestjs/common';
import { ProfileContext, ProfilePermissionsService } from '@/profiles';
import { BaseContentPolicy } from './base-content.policy';
import { BasePermissionType, getPermission, getContentCreatePermissionId } from '@lyvely/interface';
import { PROFILE_CONTEXT_META_CONTENT_TYPE } from '../content.constants';

@Injectable()
export abstract class BaseContentCreatePolicy extends BaseContentPolicy {
  async verify(context: ProfileContext): Promise<boolean> {
    if (typeof context.meta[PROFILE_CONTEXT_META_CONTENT_TYPE] !== 'string')
      return context.isProfileMember();

    const permission = getPermission(
      getContentCreatePermissionId(context.meta[PROFILE_CONTEXT_META_CONTENT_TYPE]),
      BasePermissionType.Content
    );

    // If a custom manage permission is set, we only allow management permission access.
    if (permission) {
      return this.moduleRef
        .get(ProfilePermissionsService, {
          strict: false,
        })
        .verifyPermission(context, permission);
    }

    return context.isProfileMember();
  }
}
