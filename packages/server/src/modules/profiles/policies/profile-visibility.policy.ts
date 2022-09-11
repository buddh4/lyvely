import { ProfilePolicyContext } from '../guards';
import { ProfilePolicy } from './profile.policy';
import { ProfileVisibilityLevel } from '@lyvely/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileVisibilityPolicy implements ProfilePolicy {
  async validate(context: ProfilePolicyContext): Promise<boolean> {
    const { profile, profileRelations } = context.getRequest();

    if(!profile) {
      return false;
    }

    switch (profile.visibility) {
      case ProfileVisibilityLevel.Member:
        return profileRelations && profileRelations.isMember();
      case ProfileVisibilityLevel.User:
        return profileRelations && !profileRelations.isGuest();
      case ProfileVisibilityLevel.Visitor:
        return true;
      default:
        return false;
    }
  }
}
