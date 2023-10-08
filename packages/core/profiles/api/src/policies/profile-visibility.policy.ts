import { IProfilePolicy } from '../interfaces';
import { ProfileVisibilityLevel } from '@lyvely/profiles-interface';
import { Injectable } from '@nestjs/common';
import { ProfileContext } from '../models';

@Injectable()
export class ProfileVisibilityPolicy implements IProfilePolicy {
  async verify(context: ProfileContext): Promise<boolean> {
    const { profile } = context;

    if (!profile) return false;

    switch (profile.visibility) {
      case ProfileVisibilityLevel.Member:
        return context.isProfileMember();
      case ProfileVisibilityLevel.Organization:
        return context.isProfileMember() || !!context.getOrganizationContext()?.isProfileMember();
      case ProfileVisibilityLevel.User:
        return context.isUser();
      case ProfileVisibilityLevel.Visitor:
        return true;
      default:
        return false;
    }
  }
}
