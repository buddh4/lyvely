import { Content } from '../schemas';
import { Inject } from '@nestjs/common';
import { ContentTypeRegistry } from '../components';
import { Dao, DocumentIdentity, TObjectId } from '@/core';
import { ContentTypeDao } from './content-type.dao';
import { ProfileShardData } from '@/profiles';

@Dao(Content)
export class ContentDao extends ContentTypeDao<Content> {
  @Inject()
  protected override typeRegistry: ContentTypeRegistry;

  incrementChildCount(context: ProfileShardData, parent: DocumentIdentity<Content>) {
    return this.updateOneByProfileAndId(context, parent, { $inc: { 'meta.childCount': 1 } });
  }

  decrementChildCount(context: ProfileShardData, parent: DocumentIdentity<Content>) {
    return this.updateOneByProfileAndFilter(
      context,
      parent,
      { $inc: { 'meta.childCount': 1 } },
      { 'meta.childCount': { $gt: 0 } }
    );
  }

  updateMilestone(
    context: ProfileShardData,
    content: DocumentIdentity<Content>,
    mid: TObjectId | string
  ) {
    return this.updateOneByProfileAndIdSet(context, content, { 'meta.mid': mid });
  }

  getModuleId(): string {
    return 'content';
  }
}
