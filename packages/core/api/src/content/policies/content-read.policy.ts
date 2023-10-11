import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { getPolicyToken } from '@/policies';
import { BaseContentReadPolicy } from './base-content-read.policy';
import { BaseContentManagePolicy } from './base-content-manage.policy';
import { ContentManagePolicy } from './content-manage.policy';
import { EntityNotFoundException } from '@lyvely/common';

@Injectable()
export class ContentReadPolicy extends BaseContentReadPolicy {
  async verify(context: ProfileContentContext): Promise<boolean> {
    const { content } = context;

    if (!content) throw new EntityNotFoundException();

    const managePolicy = this.moduleRef.get<BaseContentManagePolicy>(
      getPolicyToken(ContentManagePolicy.name),
    );

    if (await managePolicy.verify(context)) return true;

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
