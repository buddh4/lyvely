import { Content, ProfileContentContext } from '../schemas';
import { Injectable, Logger } from '@nestjs/common';
import { ContentDao, IContentSearchFilter } from '../daos';
import { DocumentNotFoundException } from '@lyvely/interface';
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

@Injectable()
export class ContentService {
  protected logger = new Logger(ContentService.name);

  constructor(
    private contentDao: ContentDao,
    protected contentPolicyService: ContentPolicyService
  ) {}

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
  public async findByContextAndId(
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
}
