import { Content, ProfileContentContext } from '../schemas';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ContentDao, IContentSearchFilter } from '../daos';
import {
  DocumentNotFoundException,
  FieldValidationException,
  UpdateTaskListItemModel,
} from '@lyvely/interface';
import { ProfileContext } from '@/profiles';
import {
  assureObjectId,
  DocumentIdentity,
  IBaseFetchQueryOptions,
  IFetchQueryOptions,
  TObjectId,
} from '@/core';
import { User } from '@/users';
import { ContentPolicyService } from './content-policy.service';
import { updateMarkdownTaskListItem } from '@/markdown';

@Injectable()
export class ContentService {
  protected logger = new Logger(ContentService.name);

  constructor(
    private contentDao: ContentDao,
    protected contentPolicyService: ContentPolicyService
  ) {}

  /**
   * Searches for content based on the provided context and filter.
   *
   * @param {ProfileContext} context - The profile context used for searching content.
   * @param {IContentSearchFilter} filter - The filter criteria for searching content.
   * @return {Promise<Content[]>} - A promise that resolves to an array of content.
   */
  async search(context: ProfileContext, filter: IContentSearchFilter): Promise<Content[]> {
    const contents = await this.contentDao.search(context.profile, filter);
    return this.contentPolicyService.populateContentPolicies(context, contents);
  }

  /**
   * Retrieves a list of Content objects based on the given profile context and
   * document identities, populates their policies, and filters them by read access.
   *
   * @param {ProfileContext} context - The profile context containing user details and settings.
   * @param {DocumentIdentity<Content>[]} cids - An array of document identities to be fetched.
   * @return {Promise<Content[]>} A promise that resolves to an array of Content objects that the user has read access to.
   */
  async findByIds(context: ProfileContext, cids: DocumentIdentity<Content>[]): Promise<Content[]> {
    const contents = await this.contentDao.findAllByProfileAndIds(context.profile, cids);
    await this.contentPolicyService.populateContentPolicies(context, contents);
    return contents.filter((content) => content.policies.canRead);
  }

  /**
   * Finds a single content document and populates its content policies. When using this function, you either need to
   * manually validate the required policies or use the `roleLevel` search filter.
   *
   * @param context
   * @param cid
   * @param filter
   * @param options
   * @private
   * @throws ForbiddenException
   */
  async findByContextAndId(
    context: ProfileContext,
    cid: DocumentIdentity<Content>,
    filter?: IContentSearchFilter,
    options?: IBaseFetchQueryOptions<Content>
  ): Promise<Content | null> {
    const content = await this.contentDao.findOneByFilter(
      context.profile,
      {
        ...filter,
        cid,
      },
      options
    );

    if (!content) return null;

    await this.contentPolicyService.populateContentPolicies(context, content);

    return content;
  }

  /**
   * Finds all content documents filtered by the given filter and populates its content policies. When using this function, you either need to
   * manually validate the required policies or use the `roleLevel` search filter.
   *
   * @param context
   * @param filter
   * @param options
   * @private
   * @throws ForbiddenException
   */
  async findAllByContext(
    context: ProfileContext,
    filter?: IContentSearchFilter,
    options?: IFetchQueryOptions<Content>
  ): Promise<Content[]> {
    const contents = await this.contentDao.findAllByFilter(context.profile, filter, options);

    await this.contentPolicyService.populateContentPolicies(context, contents);

    return contents;
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
   * Sets the milestone for a specific content identified by its content ID (cid).
   *
   * @param {ProfileContentContext} context
   * @param {TObjectId | string} mid - The ID of the milestone to set.
   * @return {Promise<boolean>} - True if the milestone was set successfully, false otherwise.
   * @throws {DocumentNotFoundException} - If the milestone cannot be found.
   */
  async setMilestone(context: ProfileContentContext, mid: TObjectId | string): Promise<boolean> {
    const { profile, content } = context;

    mid = assureObjectId(mid);

    if (!(await this.contentDao.findByProfileAndId(profile, mid))) {
      throw new DocumentNotFoundException();
    }

    return this.contentDao.updateMilestone(profile, content, mid);
  }

  /**
   * Unsets the milestone for a specific content identified by its content ID (cid).
   *
   * @param {ProfileContentContext} context
   * @return {Promise<boolean>} - True if the milestone was set successfully, false otherwise.
   * @throws {DocumentNotFoundException} - If the milestone cannot be found.
   */
  async unsetMilestone(context: ProfileContentContext): Promise<boolean> {
    const { profile, content } = context;
    return this.contentDao.updateMilestone(profile, content, null);
  }

  /**
   * Updates a task list item of the main content.
   * Throws a ConflictException if the provided update version does not match the last updated version of the item.
   *
   * @param {ProfileContentContext} context - The context in which the task list item needs to be updated.
   * @param {UpdateTaskListItemModel} update - The updated details of the task list item.
   * @return {Promise<boolean>} A promise that resolves to true if the task list item is successfully updated.
   * @throws {ConflictException} If the provided update version does not match the last updated version of the item.
   */
  async updateTaskListItem(
    context: ProfileContentContext,
    update: UpdateTaskListItemModel
  ): Promise<boolean> {
    const { profile, content } = context;
    const { position, version, checked } = update;

    if (position.length < 2)
      throw new FieldValidationException([{ property: 'position', errors: ['isValid'] }]);

    if (content.meta.updatedAt > version) throw new ConflictException();

    return this.contentDao.updateTextContent(
      profile,
      content,
      await updateMarkdownTaskListItem(content.content.getTextContent(), position, checked)
    );
  }
}
