import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../models';
import { getPolicyToken } from '@lyvely/policies';
import { BaseContentReadPolicy } from './base-content-read.policy';

@Injectable()
export class ContentReadPolicy extends BaseContentReadPolicy {
  async verify(context: ProfileContentContext): Promise<boolean> {
    const { content } = context;

    const contentReadPolicyType = content.getReadPolicy();
    if (contentReadPolicyType) {
      const contentReadPolicy = this.moduleRef.get<IContentPolicy>(
        getPolicyToken(contentReadPolicyType.name),
        { strict: false },
      );

      return contentReadPolicy.verify(context);
    }

    return super.verify(context);
  }
}
