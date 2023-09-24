import { Content } from '../schemas';
import { Injectable, Logger } from '@nestjs/common';
import { ContentDao } from '../daos';
import { EntityNotFoundException } from '@lyvely/common';
import { ProfileShard } from '@lyvely/profiles';
import { assureObjectId, EntityIdentity } from '@lyvely/core';
import { User } from '@lyvely/users';
import mongoose from 'mongoose';

@Injectable()
export class ContentService {
  protected logger = new Logger(ContentService.name);

  constructor(private contentDao: ContentDao) {}

  /**
   * Finds a single content by id related to the given profile and throws a EntityNotFoundException in case the content was not found.
   *
   * @param profileRelation
   * @param id
   * @param throwException
   * @private
   * @throws EntityNotFoundException
   */
  public async findContentByProfileAndId<
    B extends boolean | undefined | null = boolean | undefined | null,
  >(
    profileRelation: ProfileShard,
    id: EntityIdentity<Content>,
    throwException?: B,
  ): Promise<B extends false | undefined | null ? Content | undefined : Content> {
    const content = await this.contentDao.findByProfileAndId(profileRelation, id);

    if (!content && throwException) throw new EntityNotFoundException();

    return content as Content;
  }

  /**
   * Archives a content, only if the user has the required write permissions.
   *
   * @param user
   * @param content
   * @throws EntityNotFoundException
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
   * @throws EntityNotFoundException
   */
  async unarchive(user: User, content: Content): Promise<Content> {
    await this.contentDao.unarchive(user, content);
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
    mid: mongoose.Types.ObjectId | string,
  ): Promise<boolean> {
    mid = assureObjectId(mid, false);
    const milestone = this.contentDao.findByProfileAndId(profileRelation, mid);

    if (!milestone) throw new EntityNotFoundException();

    return this.contentDao.updateOneByProfileAndIdSet(profileRelation, cid, { 'meta.mid': mid });
  }
}
