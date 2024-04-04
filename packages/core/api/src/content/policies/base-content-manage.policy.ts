import { Injectable } from '@nestjs/common';
import { ProfileContentContext } from '../schemas';
import {
  BasePermissionType,
  getContentManagePermissionId,
  getPermission,
  ProfileMembershipRole,
} from '@lyvely/interface';
import { ProfileMembershipPolicy } from '@/profiles';
import { InjectPolicy } from '@/policies';
import { BaseContentPolicy } from './base-content.policy';

/**
 * Represents the default ContentManagePolicy which applies to content entries unless the content type
 * provides a custom content manage policy.
 *
 * This policy grants access if:
 *
 * If the content type provides a manage permission, the permission verification is used.
 *
 * If no content type manage permission is found:
 * - The user needs to be an active member of the profile.
 * - Owner, Admin, Moderator users are allowed to manage.
 * - If manager users were assigned to the content, only those are granted the content manager policy.
 * - If no manager was assigned to a content, the content author is granted this policy.
 *
 */
@Injectable()
export abstract class BaseContentManagePolicy extends BaseContentPolicy {
  @InjectPolicy(ProfileMembershipPolicy.name)
  private readonly membershipPolicy: ProfileMembershipPolicy;

  async verify(context: ProfileContentContext): Promise<boolean> {
    const { content, user } = context;

    const permission = getPermission(
      getContentManagePermissionId(content.type),
      BasePermissionType.Content,
    );

    // If a custom manage permission is set, we only allow management permission access.
    if (permission)
      return this.getContentPermissionsService().verifyPermission(context, permission);

    // Fallback
    if (!(await this.membershipPolicy.verify(context))) return false;

    // Owner, Admin, Moderators can manage content by default.
    if (
      context.getMembership(
        ProfileMembershipRole.Owner,
        ProfileMembershipRole.Admin,
        ProfileMembershipRole.Moderator,
      )
    ) {
      return true;
    }

    // Either a manager was assigned or the author as fallback.
    return content.meta.managers?.length ? content.isManager(user) : content.isAuthor(user);
  }
}
