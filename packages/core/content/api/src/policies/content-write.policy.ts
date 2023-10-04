import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { ModuleRef } from '@nestjs/core';
import { getPolicyToken } from '@lyvely/policies';
import { BaseContentWritePolicy } from './base-content-write.policy';

@Injectable()
export class ContentWritePolicy extends BaseContentWritePolicy {
  constructor(private moduleRef: ModuleRef) {
    super();
  }

  async verify(context: ProfileContentContext): Promise<boolean> {
    const { content } = context;

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
