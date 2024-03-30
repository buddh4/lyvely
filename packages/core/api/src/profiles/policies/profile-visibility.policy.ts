import { IProfilePolicy } from '../interfaces';
import { Injectable } from '@nestjs/common';
import { ProfileContext } from '../models';
import { verifyProfileVisibilityLevel } from '@lyvely/interface';

@Injectable()
export class ProfileVisibilityPolicy implements IProfilePolicy {
  async verify(context: ProfileContext): Promise<boolean> {
    const { profile } = context;

    if (!profile) return false;

    return verifyProfileVisibilityLevel(context.getRole(), profile.visibility);
  }
}
