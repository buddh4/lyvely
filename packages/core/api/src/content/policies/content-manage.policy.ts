import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { getPolicyToken } from '@/policies';
import { BaseContentManagePolicy } from './base-content-manage.policy';
import { DocumentNotFoundException } from '@lyvely/interface';

/**
 * A policy for managing general access to content features as updating, archiving and deleting as well as tag assignment.
 *
 * By default, this policy enforces following rules:
 *
 * - **User Membership**: The user must be an active member of the associated profile.
 * - **Manager Assignment**:
 *   - If managers are assigned to the content, only these individuals are bestowed with the `ContentManagePolicy`.
 *   - In cases where no manager is assigned, the content author automatically receives this policy.
 * - If no manager was assigned to a content, the content author is granted this policy.
 * - **Manager Assignment**: Profile Owners and Administrators as well as Moderators are inherently granted
 * the `ContentManagePolicy`.
 *
 * A content type may overwrite this policy by overwriting the `getManagePolicy()` function.
 */
@Injectable()
export class ContentManagePolicy extends BaseContentManagePolicy {
  override async verify(context: ProfileContentContext): Promise<boolean> {
    const { content } = context;

    if (!content) throw new DocumentNotFoundException();

    const contentManagePolicyType = content.getManagePolicy();
    if (contentManagePolicyType) {
      const contentManagePolicy = this.moduleRef.get<IContentPolicy>(
        getPolicyToken(contentManagePolicyType.name),
        { strict: false },
      );

      return contentManagePolicy.verify(context);
    }

    return super.verify(context);
  }
}
