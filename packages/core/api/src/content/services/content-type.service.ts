import { ProfilesService, Profile, ProfileTagsService } from '@/profiles';
import { ContentTypeDao, ContentDao } from '../daos';
import { User } from '@/users';
import {
  assureObjectId,
  EntityIdentity,
  IBaseQueryOptions,
  UpdateQuerySet,
  FilterQuery,
} from '@/core';
import { Content, ContentCondition } from '../schemas';
import { EntityNotFoundException, ForbiddenServiceException } from '@lyvely/common';
import { CreateContentModel } from '@lyvely/interface';
import { Inject, Logger } from '@nestjs/common';
import { ContentEventPublisher } from '../components';
import { isDefined } from 'class-validator';

export interface IContentUpdateOptions extends IBaseQueryOptions {
  streamSort?: boolean;
  updatedByUser?: boolean;
  liveUpdate?: boolean;
  tagNames?: string[];
}

export interface IContentSearchFilter {
  archived?: boolean;
}

export abstract class ContentTypeService<
  T extends Content,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<TCreateModel> = Partial<TCreateModel>,
> {
  @Inject()
  protected profileService: ProfilesService;

  @Inject()
  protected profileTagsService: ProfileTagsService;

  protected abstract contentDao: ContentTypeDao<T>;

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

  async findAllByProfile(profile: Profile, filter?: IContentSearchFilter): Promise<T[]> {
    let queryFilter: FilterQuery<Content> | undefined = undefined;
    if (isDefined(filter?.archived)) {
      queryFilter = ContentCondition.archived(filter!.archived!);
    }
    return this.contentDao.findAllByProfile(profile, queryFilter);
  }

  async findByProfileAndId(profile: Profile, id: EntityIdentity<T>): Promise<T | null> {
    return this.contentDao.findByProfileAndId(profile, id);
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

    // This needs to be the first step since we throw an exception in case the parent does not exist
    const parent = await this.handleSubContentCreation(profile, instance, model);

    instance.tagIds = profile.getTagIdsByName(model.tagNames || []);
    instance.meta.createdBy = assureObjectId(user);

    await this.mergeTags(profile, instance, model.tagNames);
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
    if (!updateSet) return;

    if (updateSet.meta) {
      updateSet.meta.streamSort = Date.now();
    } else {
      (<any>updateSet['meta.streamSort']) = Date.now();
    }
  }

  private setUpdatedBy(updateSet: UpdateQuerySet<T>, user: User) {
    if (!updateSet) return;

    if (updateSet.meta) {
      updateSet.meta.updatedBy = assureObjectId(user);
      updateSet.meta.updatedAt = new Date();
    } else {
      (<any>updateSet['meta.updatedBy']) = assureObjectId(user);
      (<any>updateSet['meta.updatedAt']) = new Date();
    }
  }

  private async handleSubContentCreation(profile: Profile, instance: T, model: TCreateModel) {
    if (!model.parentId) return;

    const parent = await this.baseContentDao.findByProfileAndId(profile, model.parentId);
    if (!parent) throw new EntityNotFoundException();
    if (!parent.pid.equals(profile._id)) throw new EntityNotFoundException();
    if (parent.meta.archived || parent.meta.locked) throw new ForbiddenServiceException();

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
    if (!tagNames || !update) return;

    if (!tagNames.length) {
      update.tagIds = [];
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
}
