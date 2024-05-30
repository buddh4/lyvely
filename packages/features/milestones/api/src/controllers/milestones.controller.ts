import {
  AbstractContentTypeController,
  ContentReadPolicy,
  ContentTypeController,
  ProfileContentRequest,
  Policies,
  ProfileRequest,
} from '@lyvely/api';
import { Milestone } from '../schemas';
import {
  CreateMilestoneModel,
  MilestoneModel,
  UpdateMilestoneModel,
  UpdateMilestoneResponse,
  ENDPOINT_MILESTONES,
  MilestonesEndpoint,
  MilestoneListResponse,
} from '@lyvely/milestones-interface';
import { MilestonesService, MilestonesCalendarPlanService } from '../services';
import { Get, Inject, Request } from '@nestjs/common';

@ContentTypeController(ENDPOINT_MILESTONES, MilestoneModel.contentType)
export class MilestonesController
  extends AbstractContentTypeController<
    Milestone,
    CreateMilestoneModel,
    UpdateMilestoneModel,
    MilestoneModel
  >
  implements MilestonesEndpoint
{
  @Inject()
  protected contentService: MilestonesService;

  @Inject()
  protected calendarPlanService: MilestonesCalendarPlanService;

  protected createModelType = CreateMilestoneModel;
  protected updateModelType = UpdateMilestoneModel;
  protected updateResponseType = UpdateMilestoneResponse;

  @Get()
  async getAll(@Request() req: ProfileRequest): Promise<MilestoneListResponse> {
    const { context } = req;
    const models = await this.contentService.findAllByContext(context, { archived: false });
    return new MilestoneListResponse({
      models: models.map((model) => model.toModel() as MilestoneModel<any>),
    });
  }

  @Get(':cid')
  @Policies(ContentReadPolicy)
  async getById(@Request() req: ProfileContentRequest<Milestone>): Promise<MilestoneModel> {
    const { content } = req;
    return content.toModel() as MilestoneModel<any>;
  }
}
