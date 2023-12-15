import { IProfilePolicy } from '../interfaces';
import { getProfileRoleLevel, getProfileRoleLevelByProfileVisibility } from '@lyvely/interface';
import { Injectable } from '@nestjs/common';
import { ProfileContext } from '../models';

@Injectable()
export class ProfileVisibilityPolicy implements IProfilePolicy {
  async verify(context: ProfileContext): Promise<boolean> {
    const { profile } = context;

    if (!profile) return false;

    return (
      getProfileRoleLevel(context.getRole()) <=
      getProfileRoleLevelByProfileVisibility(profile.visibility)
    );
  }
}
