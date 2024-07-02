import { Content } from '../schemas';
import { Inject } from '@nestjs/common';
import { ContentTypeRegistry } from '../components';
import { Dao, DocumentIdentity, TObjectId } from '@/core';
import { ContentTypeDao } from './content-type.dao';
import { ProfileShardData } from '@/profiles';
import { TenancyIsolation } from '@/core/tenancy';

/**
 * A generic content DAO used for common content data access jobs.
 * @extends ContentTypeDao<Content>
 */
@Dao(Content, { isolation: TenancyIsolation.Profile })
export class ContentDao extends ContentTypeDao<Content> {
  @Inject()
  protected override typeRegistry: ContentTypeRegistry;

  /**
   * Increments the child count of a parent document by 1.
   *
   * @param {ProfileShardData} context - The profile shard data.
   * @param {DocumentIdentity<Content>} parent - The identity of the parent document.
   * @return {Promise<WriteOpResult>} - A promise that resolves with the result of the update operation.
   */
  async incrementChildCount(
    context: ProfileShardData,
    parent: DocumentIdentity<Content>
  ): Promise<boolean> {
    return this.updateOneByProfileAndId(context, parent, { $inc: { 'meta.childCount': 1 } });
  }

  /**
   * Decrements the child count of a parent document.
   *
   * @param {ProfileShardData} context - The context of the operation.
   * @param {DocumentIdentity<Content>} parent - The parent document to decrement the child count for.
   *
   * @return {Promise} A promise that resolves with the result of the update operation.
   */
  async decrementChildCount(
    context: ProfileShardData,
    parent: DocumentIdentity<Content>
  ): Promise<boolean> {
    return this.updateOneByProfileAndFilter(
      context,
      parent,
      { $inc: { 'meta.childCount': 1 } },
      { 'meta.childCount': { $gt: 0 } }
    );
  }

  /**
   * Updates a milestone document identified by the provided mid value.
   *
   * @param {ProfileShardData} context - The profile shard data to use for updating the milestone.
   * @param {DocumentIdentity<Content>} content - The content of the milestone document.
   * @param {TObjectId | string} mid - The id or ObjectId of the milestone to update.
   * @returns {Promise<void>} - A promise that resolves when the milestone is updated successfully.
   */
  async updateMilestone(
    context: ProfileShardData,
    content: DocumentIdentity<Content>,
    mid: TObjectId | string
  ): Promise<boolean> {
    return this.updateOneByProfileAndIdSet(context, content, { 'meta.mid': mid });
  }

  /**
   * Update the text content of a document.
   *
   * @param {DocumentIdentity<Content>} identity - The identity of the document to update.
   * @param {string} update - The new text content to set.
   * @returns {Promise<void>} - A promise that resolves when the update is complete.
   */
  async updateTextContent(
    context: ProfileShardData,
    identity: DocumentIdentity<Content>,
    update: string
  ): Promise<boolean> {
    return this.updateOneByProfileAndId(context, identity, { 'content.text': update });
  }
}
