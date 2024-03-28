import { Content, ProfileContentContext } from '../schemas';
import { Injectable, Logger } from '@nestjs/common';
import { ContentDao } from '../daos';
import { DocumentNotFoundException } from '@lyvely/interface';
import { ProfileContext, ProfileShardData } from '@/profiles';
import { assureObjectId, DocumentIdentity, TObjectId } from '@/core';
import { User } from '@/users';
import { InjectPolicy } from '@/policies';
import {
  ContentDeletePolicy,
  ContentManagePolicy,
  ContentReadPolicy,
  ContentWritePolicy,
} from '@/content/policies';

@Injectable()
export class ContentService {
  protected logger = new Logger(ContentService.name);

  constructor(
    private contentDao: ContentDao,
    @InjectPolicy(ContentWritePolicy.name)
    protected contentWritePolicy: ContentWritePolicy,

    @InjectPolicy(ContentReadPolicy.name)
    protected contentReadPolicy: ContentReadPolicy,

    @InjectPolicy(ContentDeletePolicy.name)
    protected contentDeletePolicy: ContentDeletePolicy,

    @InjectPolicy(ContentManagePolicy.name)
    protected contentManagePolicy: ContentManagePolicy,
  ) {}

  /**
   * Finds a single content by id related to the given profile and throws a DocumentNotFoundException in case the content was not found.
   *
   * Note: The content returned by this function does not include populated policies.
   *
   * @param profileRelation
   * @param id
   * @param throwException
   * @private
   * @throws DocumentNotFoundException
   */
  public async findContentByProfileAndId<
    B extends boolean | undefined | null = boolean | undefined | null,
  >(
    profileRelation: ProfileShardData,
    id: DocumentIdentity<Content>,
    throwException?: B,
  ): Promise<B extends false | undefined | null ? Content | undefined : Content> {
    const content = await this.contentDao.findByProfileAndId(profileRelation, id);

    if (!content && throwException) throw new DocumentNotFoundException();

    return content as Content;
  }

  /**
   * Archives a given content.
   *
   * @param user
   * @param content
   * @throws DocumentNotFoundException
   */
  async archive(user: User, content: Content): Promise<Content> {
    await this.contentDao.archive(user, content);
    if (content.meta.parentId) {
      this.contentDao.decrementChildCount(content, content.meta.parentId).catch((e) => {
        this.logger.error(e);
      });
    }
    return content;
  }

  /**
   * Restores a content from the archive.
   *
   * @param user
   * @param content
   * @throws DocumentNotFoundException
   */
  async restore(user: User, content: Content): Promise<Content> {
    await this.contentDao.restore(user, content);
    if (content.meta.parentId) {
      this.contentDao.incrementChildCount(content, content.meta.parentId).catch((e) => {
        this.logger.error(e);
      });
    }
    return content;
  }

  /**
   * Populates content policies for the given content and context.
   *
   * @param {Content|Content[]} content - The content or an array of content to populate the policies for.
   * @param {ProfileContext} context - The context in which the content policies are populated.
   *
   * @return {Promise<void>} - A promise that resolves when the content policies have been populated.
   */
  async populateContentPolicies(content: Content | Content[], context: ProfileContext) {
    content = Array.isArray(content) ? content : [content];
    await Promise.all(content.map((c) => this._populateContentPolicies(c, context)));
  }

  /**
   * Populates the content policies for the given content and profile context.
   *
   * @param {Content} content - The content for which to populate the policies.
   * @param {ProfileContext} context - The profile context to use for policy checking.
   * @return {Promise<void>} A Promise that resolves once the content policies are populated.
   */
  private async _populateContentPolicies(content: Content, context: ProfileContext) {
    const contentContext: ProfileContentContext =
      context instanceof ProfileContentContext
        ? context
        : new ProfileContentContext({
            ...context,
            content,
          });

    const [canRead, canWrite, canManage, canDelete] = await Promise.all([
      this.canRead(content, contentContext),
      this.canWrite(content, contentContext),
      this.canManage(content, contentContext),
      this.canDelete(content, contentContext),
    ]);

    content.policies = {
      ...content.policies,
      canRead,
      canWrite,
      canManage,
      canDelete,
    };
  }

  /**
   * Checks if the given content can be read in the specified context.
   *
   * @param {Content} content - The content to be checked.
   * @param {ProfileContext} context - The context used for the check.
   *
   * @return {Promise<boolean>} - Returns a Promise that resolves to true if the content can be read by the context,
   *                             and false otherwise.
   */
  async canRead(content: Content, context: ProfileContext) {
    const contentContext: ProfileContentContext =
      context instanceof ProfileContentContext
        ? context
        : new ProfileContentContext({
            ...context,
            content,
          });
    return this.contentReadPolicy.verify(contentContext);
  }

  /**
   * Checks if the given content can be written in the specified context.
   *
   * @param {Content} content - The content to check.
   * @param {ProfileContext} context - The context containing information about the user.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the user can write the content, otherwise `false`.
   */
  async canWrite(content: Content, context: ProfileContext) {
    const contentContext: ProfileContentContext =
      context instanceof ProfileContentContext
        ? context
        : new ProfileContentContext({
            ...context,
            content,
          });
    return this.contentWritePolicy.verify(contentContext);
  }

  /**
   * Checks if the given content can be managed in the specified context.
   *
   * @param {Content} content - The content to check.
   * @param {ProfileContext} context - The context containing information about the user.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the user can write the content, otherwise `false`.
   */
  async canManage(content: Content, context: ProfileContext) {
    const contentContext: ProfileContentContext =
      context instanceof ProfileContentContext
        ? context
        : new ProfileContentContext({
            ...context,
            content,
          });
    return this.contentManagePolicy.verify(contentContext);
  }

  /**
   * Checks if the given content can be deleted in the specified context.
   *
   * @param {Content} content - The content to check.
   * @param {ProfileContext} context - The context containing information about the user.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the user can write the content, otherwise `false`.
   */
  async canDelete(content: Content, context: ProfileContext) {
    const contentContext: ProfileContentContext =
      context instanceof ProfileContentContext
        ? context
        : new ProfileContentContext({
            ...context,
            content,
          });
    return this.contentDeletePolicy.verify(contentContext);
  }

  /**
   * Sets the milestone for a specific content identified by its content ID (cid).
   *
   * @param {ProfileShardData} profileRelation - The profile relation of the content.
   * @param {User} user - The user performing the action.
   * @param {DocumentIdentity<Content>} cid - The content ID of the document.
   * @param {TObjectId | string} mid - The ID of the milestone to set.
   * @return {Promise<boolean>} - True if the milestone was set successfully, false otherwise.
   * @throws {DocumentNotFoundException} - If the milestone cannot be found.
   */
  async setMilestone(
    profileRelation: ProfileShardData,
    user: User,
    cid: DocumentIdentity<Content>,
    mid: TObjectId | string,
  ): Promise<boolean> {
    mid = assureObjectId(mid);
    const milestone = this.contentDao.findByProfileAndId(profileRelation, mid);

    if (!milestone) throw new DocumentNotFoundException();

    return this.contentDao.updateOneByProfileAndIdSet(profileRelation, cid, { 'meta.mid': mid });
  }
}
