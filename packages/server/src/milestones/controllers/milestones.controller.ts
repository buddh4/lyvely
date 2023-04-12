import {
  AbstractContentTypeController,
  ContentReadPolicy,
  ContentTypeController,
  ProfileContentRequest,
} from '@/content';
import { Milestone } from '@/milestones/schemas';
import {
  CreateMilestoneModel,
  MilestoneModel,
  UpdateMilestoneModel,
  UpdateMilestoneResponse,
  ENDPOINT_MILESTONES,
  MilestonesEndpoint,
  MilestoneListResponse,
} from '@lyvely/common';
import { MilestonesService } from '@/milestones/services';
import { Get, Inject, Request } from '@nestjs/common';
import { Policies } from '@/policies';
import { MilestonesCalendarPlanService } from '@/milestones/services/milestones-calendar-plan.service';
import { ProfileRequest } from '@/profiles';

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
  @Policies(ContentReadPolicy)
  async getAll(@Request() req: ProfileRequest): Promise<MilestoneListResponse> {
    const { profile } = req;
    const models = await this.contentService.findAllByProfile(profile, { archived: false });
    return new MilestoneListResponse({
      models: models.map((model) => model.toModel()),
    });
  }

  @Get(':cid')
  @Policies(ContentReadPolicy)
  async getById(@Request() req: ProfileContentRequest<Milestone>): Promise<MilestoneModel> {
    const { content } = req;
    return content.toModel();
  }
}
