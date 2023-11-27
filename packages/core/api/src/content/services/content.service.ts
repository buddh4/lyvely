import { Content } from '../schemas';
import { Injectable, Logger } from '@nestjs/common';
import { ContentDao } from '../daos';
import { DocumentNotFoundException } from '@lyvely/interface';
import { ProfileShard } from '@/profiles';
import { assureObjectId, EntityIdentity, TObjectId } from '@/core';
import { User } from '@/users';

@Injectable()
export class ContentService {
  protected logger = new Logger(ContentService.name);

  constructor(private contentDao: ContentDao) {}

  /**
   * Finds a single content by id related to the given profile and throws a DocumentNotFoundException in case the content was not found.
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
    profileRelation: ProfileShard,
    id: EntityIdentity<Content>,
    throwException?: B,
  ): Promise<B extends false | undefined | null ? Content | undefined : Content> {
    const content = await this.contentDao.findByProfileAndId(profileRelation, id);

    if (!content && throwException) throw new DocumentNotFoundException();

    return content as Content;
  }

  /**
   * Archives a content, only if the user has the required write permissions.
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
   * Un-archives a content, only if the user has the required write permissions.
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

  async setMilestone(
    profileRelation: ProfileShard,
    user: User,
    cid: EntityIdentity<Content>,
    mid: TObjectId | string,
  ): Promise<boolean> {
    mid = assureObjectId(mid);
    const milestone = this.contentDao.findByProfileAndId(profileRelation, mid);

    if (!milestone) throw new DocumentNotFoundException();

    return this.contentDao.updateOneByProfileAndIdSet(profileRelation, cid, { 'meta.mid': mid });
  }
}
