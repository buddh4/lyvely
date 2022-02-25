
import { ProfilesService } from '../../profiles';
import { AbstractContentDao } from '../daos';
import { User } from '../../users/schemas/users.schema';
import { assureObjectId, EntityIdentity } from '../../db/db.utils';
import { Content } from '../schemas';
import { Profile } from '../../profiles';
import { EntityNotFoundException } from '../../core/exceptions';
import { Inject } from '@nestjs/common';
import { UpdateQuery } from '../../db/abstract.dao';
import { Plain } from 'lyvely-common/src';

export abstract class AbstractContentService<T extends Content> {

  @Inject()
  protected profileService: ProfilesService;

  constructor(protected contentDao: AbstractContentDao<T>) {}

  async findById(id: EntityIdentity<T>): Promise<T|null> {
    return this.contentDao.findById(id)
  }

  async createContent(profile: Profile, model: T): Promise<T> {
    await this.profileService.mergeCategories(profile, model.categories);
    return this.contentDao.create(model);
  }

  async updateContent(profile: Profile, id: EntityIdentity<T>, update: UpdateQuery<T>): Promise<any> {
    await this.profileService.mergeCategories(profile, update.categories);
    return this.contentDao.updateOneSet(id, update)
  }


  /**
   * Archives an content, only if the user has the required write permissions.
   *
   * @param user
   * @param identity
   * @throws EntityNotFoundException
   * @throws ForbiddenServiceException
   */
  async archive(user: User, identity: EntityIdentity<T>): Promise<boolean> {
    const { content } = await this.findWritableContentAndProfile(user, identity);
    const success = await this.contentDao.archive(content);

    if(success && typeof identity === 'object') {
      (<T> identity).archived = true;
    }

    return success;
  }

  /**
   * Un-archives an content, only if the user has the required write permissions.
   *
   * @param user
   * @param identity
   * @throws EntityNotFoundException
   * @throws ForbiddenServiceException
   */
  async unarchive(user: User, identity: EntityIdentity<T>): Promise<boolean> {
    const { content } = await this.findWritableContentAndProfile(user, identity);
    const success = await this.contentDao.unarchive(content);

    if(success && typeof identity === 'object') {
      (<T> identity).archived = false;
    }

    return success;
  }

  /**
   * Finds a single content by id, only if its writable by the given user
   *
   * @param user
   * @param id
   * @private
   * @throws EntityNotFoundException
   * @throws ForbiddenServiceException
   */
  protected async findWritableContentAndProfile(user: User, id: EntityIdentity<T>): Promise<{content: T, profile: Profile}> {
    const content = await this.contentDao.findById(id);

    if(!content) {
      throw new EntityNotFoundException();
    }

    const { profile } = await this.profileService.findProfileMembershipByUserAndId(user, assureObjectId(content.pid));

    if(!profile) {
      throw new EntityNotFoundException();
    }

    return {content: content, profile: profile};
  }

}