import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { ModuleRef } from '@nestjs/core';
import { getPolicyToken } from '@/policies';
import { BaseContentWritePolicy } from './base-content-write.policy';
import { ContentManagePolicy } from './content-manage.policy';
import { BaseContentManagePolicy } from './base-content-manage.policy';
import { DocumentNotFoundException } from '@lyvely/common';

@Injectable()
export class ContentWritePolicy extends BaseContentWritePolicy {
  constructor(private moduleRef: ModuleRef) {
    super();
  }

  async verify(context: ProfileContentContext): Promise<boolean> {
    const { content } = context;

    if (!content) throw new DocumentNotFoundException();

    const managePolicy = this.moduleRef.get<BaseContentManagePolicy>(
      getPolicyToken(ContentManagePolicy.name),
    );

    if (await managePolicy.verify(context)) return true;

    const contentWritePolicyType = content.getWritePolicy();
    if (contentWritePolicyType) {
      const contentWritePolicy = this.moduleRef.get<IContentPolicy>(
        getPolicyToken(contentWritePolicyType.name),
        { strict: false },
      );

      return contentWritePolicy.verify(context);
    }

    return super.verify(context);
  }
}
