
import { ProfilesService, Profile, UserProfileRelations, ProfileRelation } from '../../profiles';
import { AbstractContentDao } from '../daos';
import { User } from '../../users';
import { assureObjectId, EntityIdentity } from '../../db/db.utils';
import { Content } from '../schemas';
import { EntityNotFoundException } from '../../core/exceptions';
import { Inject } from '@nestjs/common';
import { UpdateQuerySet } from '../../db/abstract.dao';

export abstract class AbstractContentService<T extends Content> {

  @Inject()
  protected profileService: ProfilesService;

  constructor(protected contentDao: AbstractContentDao<T>) {}

  async findByProfileAndId(profile: Profile, id: EntityIdentity<T>): Promise<T|null> {
    return this.contentDao.findById(id)
  }

  async createContent(profile: Profile, user: User, model: T): Promise<T> {
    await this.profileService.mergeCategories(profile, model.categories);
    model.createdBy = assureObjectId(user);
    return this.contentDao.save(model);
  }

  async findContentAndUpdate(profile: Profile, user: User, id: EntityIdentity<T>, update: UpdateQuerySet<T>) {
    await this.profileService.mergeCategories(profile, update.categories);
    // TODO: set updatedBy on content
    return this.contentDao.findOneAndSetById(id, update);
  }

  async updateContent(profile: Profile, user: User, id: EntityIdentity<T>, update: UpdateQuerySet<T>) {
    await this.profileService.mergeCategories(profile, update.categories);
    // TODO: set updatedBy on content
    return this.contentDao.updateOneSetById(id, update);
  }


  /**
   * Archives a content, only if the user has the required write permissions.
   *
   * @param profileRelations
   * @param identity
   * @throws EntityNotFoundException
   */
  async archive(profileRelations: UserProfileRelations, identity: EntityIdentity<T>): Promise<boolean> {
    return this.contentDao.archive(profileRelations, identity);
  }

  /**
   * Un-archives a content, only if the user has the required write permissions.
   *
   * @param profileRelations
   * @param identity
   * @throws EntityNotFoundException
   */
  async unarchive(profileRelations: UserProfileRelations, identity: EntityIdentity<T>): Promise<boolean> {
    return this.contentDao.unarchive(profileRelations, identity);
  }

  /**
   * Finds a single content by id related to the given profile and throws a EntityNotFoundException in case the content was not found.
   *
   * @param profileRelation
   * @param id
   * @private
   * @throws EntityNotFoundException
   */
  public async findContentByProfileAndId(profileRelation: ProfileRelation, id: EntityIdentity<T>, throwException = true): Promise<T> {
    const content = await this.contentDao.findByProfileAndId(profileRelation, id);

    if(!content && throwException) {
      throw new EntityNotFoundException();
    }

    return content;
  }

}
