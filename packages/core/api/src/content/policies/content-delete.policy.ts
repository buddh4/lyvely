import { Inject, Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { ModuleRef } from '@nestjs/core';
import { getPolicyToken } from '@/policies';
import { BaseContentDeletePolicy } from './base-content-delete.policy';
import { DocumentNotFoundException } from '@lyvely/interface';

/**
 * Represents a content delete policy used to grant access for delete/archive and restore features.
 * By default, this policy applies the same rules as `ContentManagePolicy`.
 * A content type may overwrite the default behavior of this policy by overwriting the `getDeletePolicy()` function.
 */
@Injectable()
export class ContentDeletePolicy extends BaseContentDeletePolicy {
  @Inject()
  protected readonly moduleRef: ModuleRef;

  async verify(context: ProfileContentContext): Promise<boolean> {
    const { content } = context;

    if (!content) throw new DocumentNotFoundException();

    if (!content.getTypeMeta().deletable) return false;

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
