import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { getPolicyToken } from '@/policies';
import { BaseContentReadPolicy } from './base-content-read.policy';
import { BaseContentCreatePolicy } from './base-content-create.policy';
import { ProfileContext } from '@/profiles';

@Injectable()
export class ContentCreatePolicy extends BaseContentCreatePolicy {
  async verify(context: ProfileContext): Promise<boolean> {
    return super.verify(context);
  }
}
