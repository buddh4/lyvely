import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { getPolicyToken } from '@/policies';
import { BaseContentReadPolicy } from './base-content-read.policy';
import { DocumentNotFoundException } from '@lyvely/interface';

/**
 * A policy which manages read access to content.
 * This policy will check the user role level against the content visibility level.
 * A content type may overwrite the default behavior of this policy by overwriting the `getReadPolicy()` function.
 * @implements {IContentPolicy}
 * @abstract
 */
@Injectable()
export class ContentReadPolicy extends BaseContentReadPolicy {
  override async verify(context: ProfileContentContext): Promise<boolean> {
    const { content } = context;

    if (!content) throw new DocumentNotFoundException();

    const ContentReadPolicyType = content.getReadPolicy();
    if (ContentReadPolicyType) {
      const contentReadPolicy = this.moduleRef.get<IContentPolicy>(
        getPolicyToken(ContentReadPolicyType.name),
        { strict: false },
      );

      return contentReadPolicy.verify(context);
    }

    return super.verify(context);
  }
}
