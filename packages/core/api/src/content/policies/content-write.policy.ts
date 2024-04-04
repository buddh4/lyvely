import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { getPolicyToken } from '@/policies';
import { BaseContentWritePolicy } from './base-content-write.policy';
import { DocumentNotFoundException } from '@lyvely/interface';

/**
 * Represents a content write policy.
 * By default, this policy applies the same rules as `ContentManagePolicy`.
 * A content type may overwrite the default behavior of this policy by overwriting the `getWritePolicy()` function.
 */
@Injectable()
export class ContentWritePolicy extends BaseContentWritePolicy {
  override async verify(context: ProfileContentContext): Promise<boolean> {
    const { content } = context;

    if (!content) throw new DocumentNotFoundException();

    if (content.meta.locked) return false;
    if (!content.getTypeMeta().editable) return false;

    const ContentWritePolicyType = content.getWritePolicy();
    if (ContentWritePolicyType) {
      const contentWritePolicy = this.moduleRef.get<IContentPolicy>(
        getPolicyToken(ContentWritePolicyType.name),
        { strict: false },
      );

      return contentWritePolicy.verify(context);
    }

    return super.verify(context);
  }
}
