import { Content } from '../schemas';
import { Injectable, Logger } from '@nestjs/common';
import { ContentDao } from '../daos';
import { EntityNotFoundException } from '@lyvely/common';
import { ProfileRelation } from '@/profiles';
import { EntityIdentity } from '@/core';

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
  public async findContentByProfileAndId(
    profileRelation: ProfileRelation,
    id: EntityIdentity<Content>,
    throwException = true,
  ): Promise<Content> {
    const content = await this.contentDao.findByProfileAndId(profileRelation, id);

    if (!content && throwException) {
      throw new EntityNotFoundException();
    }

    return content;
  }

  /**
   * Archives a content, only if the user has the required write permissions.
   *
   * @param context
   * @param identity
   * @throws EntityNotFoundException
   */
  async archive(context: ProfileRelation, identity: EntityIdentity<Content>): Promise<Content> {
    const content = await this.contentDao.archive(context, identity);
    if (content && content.meta.parentId) {
      this.contentDao.decrementChildCount(context, content.meta.parentId).catch((e) => {
        this.logger.error(e);
      });
    }
    return content;
  }

  /**
   * Un-archives a content, only if the user has the required write permissions.
   *
   * @param context
   * @param identity
   * @throws EntityNotFoundException
   */
  async unarchive(context: ProfileRelation, identity: EntityIdentity<Content>): Promise<Content> {
    const content = await this.contentDao.unarchive(context, identity);
    if (content && content.meta.parentId) {
      this.contentDao.incrementChildCount(context, content.meta.parentId).catch((e) => {
        this.logger.error(e);
      });
    }
    return content;
  }
}
