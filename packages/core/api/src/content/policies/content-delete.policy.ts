import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { ModuleRef } from '@nestjs/core';
import { getPolicyToken } from '@/policies';
import { BaseContentDeletePolicy } from './base-content-delete.policy';
import { BaseContentManagePolicy } from './base-content-manage.policy';
import { ContentManagePolicy } from './content-manage.policy';
import { DocumentNotFoundException } from '@lyvely/common';

@Injectable()
export class ContentDeletePolicy extends BaseContentDeletePolicy {
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

    const contentDeletePolicyType = content.getDeletePolicy();
    if (contentDeletePolicyType) {
      const contentDeletePolicy = this.moduleRef.get<IContentPolicy>(
        getPolicyToken(contentDeletePolicyType.name),
        { strict: false },
      );

      if (content) return contentDeletePolicy.verify(context);
    }

    return super.verify(context);
  }
}
