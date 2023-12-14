import {
  ContentDataType,
  ContentService,
  ContentTypeService,
  UpdateQuerySet,
  ProtectedProfileContext,
} from '@lyvely/api';
import { Milestone, MilestoneConfig } from '../schemas';
import { CreateMilestoneModel, UpdateMilestoneModel } from '@lyvely/milestones-interface';
import { Inject, Logger } from '@nestjs/common';
import { MilestonesDao } from '../daos';

/**
 * A service responsible for creating, updating and fetching milestone documents.
 *
 * @class
 * @extends ContentTypeService<Task, CreateTaskModel>
 * @public
 */
export class MilestonesService extends ContentTypeService<
  Milestone,
  CreateMilestoneModel,
  UpdateMilestoneModel
> {
  /** Milestone content dao, responsible for data access. **/
  @Inject()
  protected contentDao: MilestonesDao;

  /** ContentScoreService, responsible for updating scores for completed milestones. **/
  @Inject()
  protected contentService: ContentService;

  /** Class specific logger. **/
  protected logger = new Logger(MilestonesService.name);

  /**
   * Creates a new Milestone instance from the given create model.
   * This is part of the ContentTypeService template and is responsible for mapping create models to actual
   * model instances.
   *
   * @param {ProtectedProfileContext} context - The profile context.
   * @param {CreateMilestoneModel} model - The data for creating the milestone.
   * @returns {Promise<Milestone>} - The newly created milestone instance with the assigned sort order.
   * @protected
   */
  protected async createInstance(
    context: ProtectedProfileContext,
    model: CreateMilestoneModel,
  ): Promise<Milestone> {
    const { user, profile } = context;
    const { title, text, interval } = model;
    const instance = new Milestone(profile, user, {
      content: new ContentDataType({ title, text }),
      config: new MilestoneConfig({ interval }),
    });
    instance.meta.sortOrder = await this.contentDao.getNextSortOrder(profile);
    return instance;
  }

  /**
   * Creates and applies an update to a Milestone.
   * This is part of the ContentTypeService template and is responsible for mapping update models to actual
   * document updates.
   *
   * @param context
   * @param {Milestone} milestone - The milestone object to be updated.
   * @param {UpdateMilestoneModel} update - The update model containing the changes to be made.
   * @protected
   * @returns {Milestone} - The updated milestone object.
   */
  protected async createUpdate(
    context: ProtectedProfileContext,
    milestone: Milestone,
    update: UpdateMilestoneModel,
  ): Promise<UpdateQuerySet<Milestone>> {
    return {
      content: {
        title: update.title ?? milestone.content.title,
        text: update.text ?? milestone.content.text,
      },
      config: {
        interval: update.interval ?? milestone.config.interval,
      },
    };
  }
}
