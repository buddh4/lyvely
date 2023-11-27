import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { ModuleRef } from '@nestjs/core';
import { getPolicyToken } from '@/policies';
import { BaseContentManagePolicy } from './base-content-manage.policy';
import { DocumentNotFoundException } from '@lyvely/interface';

@Injectable()
export class ContentManagePolicy extends BaseContentManagePolicy {
  constructor(private moduleRef: ModuleRef) {
    super();
  }

  async verify(context: ProfileContentContext): Promise<boolean> {
    const { content } = context;

    if (!content) throw new DocumentNotFoundException();

    const contentManagePolicyType = content.getManagePolicy();
    if (contentManagePolicyType) {
      const contentManagePolicy = this.moduleRef.get<IContentPolicy>(
        getPolicyToken(contentManagePolicyType.name),
        { strict: false },
      );

      if (content) return contentManagePolicy.verify(context);
    }

    return super.verify(context);
  }
}
