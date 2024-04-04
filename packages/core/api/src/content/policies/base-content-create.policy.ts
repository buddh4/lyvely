import { Injectable } from '@nestjs/common';
import { ProfileContext } from '@/profiles';
import { BaseContentPolicy } from './base-content.policy';

@Injectable()
export abstract class BaseContentCreatePolicy extends BaseContentPolicy {
  async verify(context: ProfileContext): Promise<boolean> {
    return context.isProfileMember();
  }
}
