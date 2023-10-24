import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { ProfileMembershipRole } from '@lyvely/core-interface';

@Injectable()
export abstract class BaseContentManagePolicy implements IContentPolicy {
  async verify(context: ProfileContentContext): Promise<boolean> {
    const { content, user } = context;

    if (!context.isProfileMember()) return false;

    return (
      content.meta.createdBy._id.equals(user!._id) ||
      !!context.getMembership(ProfileMembershipRole.Owner, ProfileMembershipRole.Admin)
    );
  }
}
