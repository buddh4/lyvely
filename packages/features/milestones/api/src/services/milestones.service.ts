import {
  ContentDataType,
  ContentService,
  ContentTypeService,
  Profile,
  User,
  UpdateQuerySet,
} from '@lyvely/api';
import { Milestone, MilestoneConfig } from '../schemas';
import { CreateMilestoneModel, UpdateMilestoneModel } from '@lyvely/milestones-interface';
import { Inject, Logger } from '@nestjs/common';
import { MilestonesDao } from '../daos';

export class MilestonesService extends ContentTypeService<
  Milestone,
  CreateMilestoneModel,
  UpdateMilestoneModel
> {
  @Inject()
  protected contentDao: MilestonesDao;

  @Inject()
  protected contentService: ContentService;

  protected logger = new Logger(MilestonesService.name);

  protected async createInstance(
    profile: Profile,
    user: User,
    model: CreateMilestoneModel,
  ): Promise<Milestone> {
    const { title, text, interval } = model;
    const instance = new Milestone(profile, user, {
      content: new ContentDataType({ title, text }),
      config: new MilestoneConfig({ interval }),
    });
    instance.meta.sortOrder = await this.contentDao.getNextSortOrder(profile);
    return instance;
  }

  protected async createUpdate(
    profile: Profile,
    user: User,
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
