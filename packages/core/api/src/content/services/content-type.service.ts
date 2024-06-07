import { Profile, ProfileContext, ProfileTagsService, ProtectedProfileContext } from '@/profiles';
import { ContentTypeDao, ContentDao, IContentSearchFilter } from '../daos';
import { User } from '@/users';
import {
  assureObjectId,
  DocumentIdentity,
  IBaseFetchQueryOptions,
  IFetchQueryOptions,
  UpdateQuerySet,
} from '@/core';
import { Content } from '../schemas';
import {
  DocumentNotFoundException,
  ForbiddenServiceException,
  CreateContentModel,
} from '@lyvely/interface';
import { Inject, Logger } from '@nestjs/common';
import { ContentEventPublisher } from '../components';
import { IContentUpdateOptions } from '../interfaces';
import { ContentPolicyService } from './content-policy.service';

/**
 * Base service class for content types, responsible for common fetch and update scenarios as well as providing a
 * template for creating and updating content documents.
 *
 * @template T - The content type.
 * @template TCreateModel - The model used for creating the content.
 * @template TUpdateModel - The model used for updating the content.
 */
export abstract class ContentTypeService<
  T extends Content,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<TCreateModel> = Partial<TCreateModel>,
  TFilter extends IContentSearchFilter = IContentSearchFilter,
> {
  /** Content type specific dao, used for general data access. **/
  protected abstract contentDao: ContentTypeDao<T, TFilter>;

  /** Class specific logger. **/
  protected abstract logger: Logger;

  /** Responsible for creating new tags assigned to content. **/
  @Inject()
  protected profileTagsService: ProfileTagsService;

  /** Generic content dao, e.g. used for accessing and updating parent content. **/
  @Inject()
  private baseContentDao: ContentDao;

  /** Responsible for triggering content specific events. **/
  @Inject()
  protected contentEvents: ContentEventPublisher;

  /** Responsible for populating content policies. **/
  @Inject()
  protected contentPolicyService: ContentPolicyService;

  /**
   * Template function, responsible for creating an actual content model by create model.
   *
   * @param {ProtectedProfileContext} context - The context required for creating the profile instance.
   * @param {TCreateModel} model - The model containing the data needed to create the profile instance.
   * @protected
   * @return {Promise<T>} - A Promise that resolves with the created profile instance.
   */
  protected abstract createInstance(
    context: ProtectedProfileContext,
    model: TCreateModel
  ): Promise<T>;

  /**
   * Template function, responsible for mapping between the update model and an actual database update query.
   *
   * @param {ProtectedProfileContext} context - The context of the operation.
   * @param {T} content - The content model instance.
   * @param {TUpdateModel} model - The model used for updating the record.
   * @returns {Promise<UpdateQuerySet<T>>} - A promise that resolves to the result of the create or update operation.
   * @protected
   */
  protected abstract createUpdate(
    context: ProtectedProfileContext,
    content: T,
    model: TUpdateModel
  ): Promise<UpdateQuerySet<T>>;

  /**
   * Finds a single content document of this type and populates its content policies. When using this function, you either need to
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
    filter?: TFilter,
    options?: IBaseFetchQueryOptions<T>
  ): Promise<T | null> {
    const content = await this.contentDao.findOneByFilter(
      context.profile,
      {
        ...filter,
        cid,
      } as TFilter,
      options
    );

    if (!content) return null;

    await this.contentPolicyService.populateContentPolicies(context, content);

    return content;
  }

  /**
   * Finds all content documents of this type filtered by the given filter and populates its content policies. When using this function, you either need to
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
    filter?: TFilter,
    options?: IFetchQueryOptions<T>
  ): Promise<T[]> {
    const contents = await this.contentDao.findAllByFilter(context.profile, filter, options);

    await this.contentPolicyService.populateContentPolicies(context, contents);

    return contents;
  }

  /**
   * Responsible for translating between tagNames and tagIds and creating new tags for tagNames which do
   * not exist for the given profile.
   *
   * @param {Object} profile - The profile object.
   * @param {T} model - The model object.
   * @param {string[]} [tagNames] - The array of tag names to merge.
   * @protected
   * @returns {Promise<void>}
   */
  protected async mergeTags(profile, model: T, tagNames?: string[]) {
    if (!tagNames) return;

    model.tagIds = [];
    await this.profileTagsService.mergeTags(profile, tagNames);
    tagNames.forEach((tagName) => model.addTag(profile.getTagByName(tagName)));
  }

  /**
   * Persists a new content model instance with the data contained in the create-model.
   *
   * @param {ProtectedProfileContext} context - The protected profile context.
   * @param {TCreateModel} model - The content create model.
   * @returns {Promise<T>} - A promise that resolves to the created content.
   */
  async createContent(context: ProtectedProfileContext, model: TCreateModel): Promise<T> {
    const { profile, user } = context;
    const instance = await this.createInstance(context, model);

    // This needs to be the first step since we throw an exception in case the parent does not exist
    const parent = await this.handleSubContentCreation(context, instance, model);

    instance.tagIds = profile.getTagIdsByName(model.tagNames || []);
    instance.meta.createdBy = assureObjectId(user);

    await this.mergeTags(profile, instance, model.tagNames);
    const result = await this.contentDao.save(instance);

    if (parent) {
      this.baseContentDao.incrementChildCount(profile, parent).catch((e) => {
        this.logger.error(e);
      });
    }

    await this.contentPolicyService.populateContentPolicies(context, result);

    this.contentEvents.emitContentCreated(result);
    return result;
  }

  /**
   * Updates the content with the provided update model values.
   *
   * @param {ProtectedProfileContext} context - The context object.
   * @param {T} content - The content object to update.
   * @param {TUpdateModel} model - The model object containing the new values.
   * @returns {Promise<T>} - A promise that resolves to the updated content object.
   */
  async updateContent(
    context: ProtectedProfileContext,
    content: T,
    model: TUpdateModel
  ): Promise<T> {
    const update = await this.createUpdate(context, content, model);
    await this.updateContentSet(context, content, update, {
      tagNames: model.tagNames,
    });
    return content;
  }

  /**
   * This function can be used to manually apply updates to a given content type instance.
   *
   * @param {ProtectedProfileContext} context - The context object containing user and profile information.
   * @param {T} content - The content object to update.
   * @param {UpdateQuerySet<T>} updateSet - The update query set specifying the fields to update.
   * @param {IContentUpdateOptions} [options] - Additional options for the update.
   * @return {Promise} A promise that resolves to the result of the update operation.
   */
  async updateContentSet(
    context: ProtectedProfileContext,
    content: T,
    updateSet: UpdateQuerySet<T>,
    options?: IContentUpdateOptions
  ) {
    const { user, profile } = context;
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

  /**
   * Sets the streamSort property of the given updateSet object with the current date and time.
   *
   * @param {UpdateQuerySet<T>} updateSet - The updateSet object to set the streamSort property on.
   * @private
   * @return {void}
   */
  private setStreamSort(updateSet: UpdateQuerySet<T>) {
    if (!updateSet) return;

    if (updateSet.meta) {
      updateSet.meta.streamSort = Date.now();
    } else {
      (<any>updateSet['meta.streamSort']) = Date.now();
    }
  }

  /**
   * Sets the updatedBy and updatedAt properties in the updateSet object.
   *
   * @param {UpdateQuerySet<T>} updateSet - The updateSet object to update.
   * @param {User} user - The user who performed the update.
   * @private
   */
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

  /**
   * Handles the creation of sub content.
   *
   * @param context
   * @param {T} instance - The instance of the sub content being created.
   * @param {TCreateModel} model - The model containing the data for creating the sub content.
   *
   * @private
   *
   * @returns {Promise} - A promise that resolves to the parent content of the sub content.
   * @throws {DocumentNotFoundException} - If the parent content is not found.
   * @throws {ForbiddenServiceException} - If the parent content is archived or locked.
   */
  private async handleSubContentCreation(
    context: ProtectedProfileContext,
    instance: T,
    model: TCreateModel
  ): Promise<Content | null> {
    if (!model.parentId) return null;

    const { profile } = context;

    const parent = await this.baseContentDao.findByProfileAndId(profile, model.parentId);

    if (!parent) throw new DocumentNotFoundException();
    if (!parent.pid.equals(profile._id)) throw new DocumentNotFoundException();
    if (parent.meta.archived || parent.meta.locked) throw new ForbiddenServiceException();
    if (!parent.getTypeMeta().commentable) throw new ForbiddenServiceException();
    if (!(await this.contentPolicyService.canRead(context, parent))) {
      throw new ForbiddenServiceException();
    }

    instance.meta.parentId = parent._id;
    instance.meta.parentPath = parent.meta.parentPath
      ? `${parent.meta.parentPath}.${parent.id}`
      : parent.id;

    return parent;
  }

  /**
   * This function manages the mapping between tagNames and tagIds, as well as creating new tags for tagNames which
   * currently do not exist on the given profile.
   *
   * @param {Profile} profile - The profile object.
   * @param {UpdateQuerySet<T>} update - The update query set.
   * @param {string[]} tagNames - The list of tag names to be merged.
   * @protected
   * @return {Promise<void>} - Returns a promise that resolves when the merge is complete.
   */
  private async mergeTagsForUpdate(
    profile: Profile,
    update: UpdateQuerySet<T>,
    tagNames?: string[]
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
