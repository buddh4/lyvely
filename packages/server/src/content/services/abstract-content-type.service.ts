import { ProfilesService, Profile, ProfileTagsService } from '@/profiles';
import { AbstractContentDao, ContentDao } from '../daos';
import { User } from '@/users';
import { assureObjectId, EntityIdentity, IBaseQueryOptions, UpdateQuerySet } from '@/core';
import { Content } from '../schemas';
import {
  CreateContentModel,
  EntityNotFoundException,
  ForbiddenServiceException,
} from '@lyvely/common';
import { Inject, Logger } from '@nestjs/common';
import { ContentEventPublisher } from '../components';

export interface IContentUpdateOptions extends IBaseQueryOptions {
  streamSort?: boolean;
  updatedByUser?: boolean;
  liveUpdate?: boolean;
  tagNames?: string[];
}

export abstract class AbstractContentTypeService<
  T extends Content,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<TCreateModel> = Partial<TCreateModel>,
> {
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

  protected abstract createInstance(profile: Profile, user: User, model: TCreateModel): Promise<T>;
  protected abstract createUpdate(
    profile: Profile,
    user: User,
    content: T,
    model: TUpdateModel,
  ): Promise<UpdateQuerySet<T>>;

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

  async createContent(profile: Profile, user: User, model: TCreateModel): Promise<T> {
    const instance = await this.createInstance(profile, user, model);
    const parent = await this.handleSubContentCreation(profile, user, instance, model);
    await this.mergeTags(profile, instance, model.tagNames);
    instance.meta.createdBy = assureObjectId(user);
    const result = await this.contentDao.save(instance);

    if (parent) {
      this.baseContentDao.incrementChildCount(profile, parent).catch((e) => {
        this.logger.error(e);
      });
    }

    this.contentEvents.emitContentCreated(result);
    return result;
  }

  async updateContent(profile: Profile, user: User, content: T, model: TUpdateModel): Promise<T> {
    const update = await this.createUpdate(profile, user, content, model);
    await this.updateContentSet(profile, user, content, update, {
      tagNames: model.tagNames,
    });
    return content;
  }

  async updateContentSet(
    profile: Profile,
    user: User,
    content: T,
    updateSet: UpdateQuerySet<T>,
    options?: IContentUpdateOptions,
  ) {
    if (options?.streamSort) {
      this.setStreamSort(updateSet);
    }

    if (options?.updatedByUser !== false) {
      this.setUpdatedBy(updateSet, user);
    }

    if (options?.tagNames) {
      await this.mergeTagsForUpdate(profile, updateSet, options?.tagNames);
    }

    return this.contentDao
      .updateOneByProfileAndIdSet(profile, content, updateSet, options)
      .then((result) => {
        if (options?.liveUpdate !== false) {
          this.contentEvents.emitContentUpdated(content);
        }
        return result;
      });
  }

  private setStreamSort(updateSet: UpdateQuerySet<T>) {
    if (updateSet.meta) {
      updateSet.meta.streamSort = Date.now();
    } else {
      (<any>updateSet['meta.streamSort']) = Date.now();
    }
  }

  private setUpdatedBy(updateSet: UpdateQuerySet<T>, user: User) {
    if (updateSet.meta) {
      updateSet.meta.updatedBy = assureObjectId(user);
      updateSet.meta.updatedAt = new Date();
    } else {
      (<any>updateSet['meta.updatedBy']) = assureObjectId(user);
      (<any>updateSet['meta.updatedAt']) = new Date();
    }
  }

  private async handleSubContentCreation(
    profile: Profile,
    user: User,
    instance: T,
    model: TCreateModel,
  ) {
    if (!model.parentId) return;
    const parent = await this.baseContentDao.findByProfileAndId(profile, model.parentId);
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
    if (!tagNames?.length) return;

    await this.profileTagsService.mergeTags(profile, tagNames);
    update.tagIds = [];
    tagNames.forEach((tagName) => {
      const tag = profile.getTagByName(tagName);
      if (tag) {
        update.tagIds.push(tag._id);
      }
    });
  }
}
