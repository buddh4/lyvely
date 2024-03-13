import { Injectable } from '@nestjs/common';
import { BaseContentCreatePolicy } from './base-content-create.policy';
import { ProfileContext } from '@/profiles';

@Injectable()
export class ContentCreatePolicy extends BaseContentCreatePolicy {
  override async verify(context: ProfileContext): Promise<boolean> {
    return super.verify(context);
  }
}
