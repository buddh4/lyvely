import { ProfilesService, Profile, ProfileTagsService, ProfileRelation } from '@/profiles';
import { AbstractContentDao, ContentDao } from '../daos';
import { User } from '@/users';
import { assureObjectId, EntityIdentity, UpdateQuerySet } from '@/core';
import { Content } from '../schemas';
import {
  CreateContentModel,
  EntityNotFoundException,
  ForbiddenServiceException,
} from '@lyvely/common';
import { Inject, Logger } from '@nestjs/common';
import { ContentEventPublisher } from '../components';

export abstract class AbstractContentService<T extends Content, TModel extends CreateContentModel> {
  @Inject()
  protected profileService: ProfilesService;

  @Inject()
  protected profileTagsService: ProfileTagsService;

  protected abstract contentDao: AbstractContentDao<T>;

  @Inject()
  private baseContentDao: ContentDao;

  @Inject()
  protected contentEvents: ContentEventPublisher;

  protected abstract logger: Logger;

  protected abstract createInstance(profile: Profile, user: User, model: TModel): Promise<T>;

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

  async createContent(profile: Profile, user: User, model: TModel): Promise<T> {
    const instance = await this.createInstance(profile, user, model);
    const parent = await this.handleSubContentCreation(profile, user, instance, model);
    await this.mergeTags(profile, instance, model.tagNames);
    instance.meta.createdBy = assureObjectId(user);
    const result = await this.contentDao.save(instance);

    if (parent) {
      this.incrementChildCount(profile, parent).catch((e) => {
        this.logger.error(e);
      });
    }

    this.contentEvents.emitContentCreated(result);
    return result;
  }

  private async incrementChildCount(context: ProfileRelation, parent: EntityIdentity<Content>) {
    return this.baseContentDao.updateOneByProfileAndId(context, parent, {
      $inc: { 'meta.childCount': 1 },
    });
  }

  private async decrementChildCount(context: ProfileRelation, parent: EntityIdentity<Content>) {
    parent =
      parent instanceof Content
        ? parent
        : await this.baseContentDao.findByProfileAndId(context, parent);
    if (parent.meta.childCount <= 0) return;
    return this.baseContentDao.updateOneByProfileAndId(context, parent, {
      $inc: { 'meta.childCount': -1 },
    });
  }

  private async handleSubContentCreation(profile: Profile, user: User, instance: T, model: TModel) {
    if (!model.parentId) return;
    const parent = await this.contentDao.findById(model.parentId);
    if (!parent) throw new EntityNotFoundException();
    if (!parent.pid.equals(profile._id)) throw new EntityNotFoundException();
    if (parent.meta.isArchived || parent.meta.isLocked) throw new ForbiddenServiceException();

    instance.meta.parentId = parent._id;
    instance.meta.parentPath = parent.meta.parentPath
      ? `${parent.meta.parentPath}.${parent.id}`
      : parent.id;

    return parent;
  }

  protected async mergeTagsForUpdate(
    profile: Profile,
    update: UpdateQuerySet<T>,
    tagNames?: string[],
  ) {
    if (!tagNames) return;

    await this.profileTagsService.mergeTags(profile, tagNames);
    update.tagIds = [];
    tagNames.forEach((tagName) => {
      const tag = profile.getTagByName(tagName);
      if (tag) {
        update.tagIds.push(tag._id);
      }
    });
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
   * @param context
   * @param identity
   * @throws EntityNotFoundException
   */
  async archive(context: ProfileRelation, identity: EntityIdentity<T>): Promise<T> {
    const content = await this.contentDao.archive(context, identity);
    if (content && content.meta.parentId) {
      this.decrementChildCount(context, content.meta.parentId).catch((e) => {
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
  async unarchive(context: ProfileRelation, identity: EntityIdentity<T>): Promise<T> {
    const content = await this.contentDao.unarchive(context, identity);
    if (content && content.meta.parentId) {
      this.incrementChildCount(context, content.meta.parentId).catch((e) => {
        this.logger.error(e);
      });
    }
    return content;
  }
}
