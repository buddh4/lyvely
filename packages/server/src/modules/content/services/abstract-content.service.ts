import { ProfilesService, Profile, ProfileContext, ProfileRelation, ProfileTagsService } from '../../profiles';
import { AbstractContentDao } from '../daos';
import { User } from '../../users';
import { assureObjectId, EntityIdentity, UpdateQuerySet } from '@/modules/core';
import { Content } from '../schemas';
import { EntityNotFoundException } from '@lyvely/common';
import { Inject } from '@nestjs/common';

export abstract class AbstractContentService<T extends Content> {
  @Inject()
  protected profileService: ProfilesService;

  @Inject()
  protected profileTagsService: ProfileTagsService;

  constructor(protected contentDao: AbstractContentDao<T>) {}

  async findByProfileAndId(profile: Profile, id: EntityIdentity<T>): Promise<T | null> {
    return this.contentDao.findById(id);
  }

  protected async mergeTags(profile, model: T, tagNames?: string[]) {
    if (!tagNames) {
      return;
    }

    model.tagIds = [];
    await this.profileTagsService.mergeTags(profile, tagNames);
    tagNames.forEach((tagName) => model.addTag(profile.getTagByName(tagName)));
  }

  async createContent(profile: Profile, user: User, model: T, tagNames?: string[]): Promise<T> {
    await this.mergeTags(profile, model, tagNames);
    model.createdBy = assureObjectId(user);
    return this.contentDao.save(model);
  }

  protected async mergeTagsForUpdate(profile: Profile, update: UpdateQuerySet<T>, tagNames?: string[]) {
    if (!tagNames) {
      return;
    }

    await this.profileTagsService.mergeTags(profile, tagNames);
    update.tagIds = [];
    tagNames.forEach((tagName) => {
      const tag = profile.getTagByName(tagName);
      if (tag) {
        update.tagIds.push(tag._id);
      }
    });
  }

  async findContentAndUpdate(
    profile: Profile,
    user: User,
    id: EntityIdentity<T>,
    update: UpdateQuerySet<T>,
    tagNames?: string[],
  ) {
    await this.mergeTagsForUpdate(profile, update, tagNames);
    // TODO: set updatedBy on content
    return this.contentDao.findOneAndSetById(id, update);
  }

  async updateContent(
    profile: Profile,
    user: User,
    id: EntityIdentity<T>,
    update: UpdateQuerySet<T>,
    tagNames?: string[],
  ) {
    await this.mergeTagsForUpdate(profile, update, tagNames);
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
  async archive(profileRelations: ProfileContext, identity: EntityIdentity<T>): Promise<boolean> {
    return this.contentDao.archive(profileRelations, identity);
  }

  /**
   * Un-archives a content, only if the user has the required write permissions.
   *
   * @param profileRelations
   * @param identity
   * @throws EntityNotFoundException
   */
  async unarchive(profileRelations: ProfileContext, identity: EntityIdentity<T>): Promise<boolean> {
    return this.contentDao.unarchive(profileRelations, identity);
  }

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
    id: EntityIdentity<T>,
    throwException = true,
  ): Promise<T> {
    const content = await this.contentDao.findByProfileAndId(profileRelation, id);

    if (!content && throwException) {
      throw new EntityNotFoundException();
    }

    return content;
  }
}
