import { ProfilePolicyContext } from './profile-policy.context';
import { ProfilePolicy } from './profile.policy';
import { ProfileVisibilityLevel } from '@lyvely/profiles-interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileVisibilityPolicy implements ProfilePolicy {
  async validate(context: ProfilePolicyContext): Promise<boolean> {
    const { profile, context: requestContext } = context.getRequest();

    if (!profile) {
      return false;
    }

    switch (profile.visibility) {
      case ProfileVisibilityLevel.Member:
        return context && requestContext.isMember();
      case ProfileVisibilityLevel.User:
        return context && !requestContext.isGuest();
      case ProfileVisibilityLevel.Visitor:
        return true;
      default:
        return false;
    }
  }
}
