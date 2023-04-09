import {
  AbstractContentTypeController,
  ContentTypeController,
  ContentWritePolicy,
  ProfileContentRequest,
} from '@/content';
import { Milestone } from '@/milestones/schemas';
import {
  CreateMilestoneModel,
  MilestoneModel,
  UpdateMilestoneModel,
  UpdateMilestoneResponse,
  ENDPOINT_MILESTONES,
  CalendarPlanFilter,
  CalendarPlanSort,
  SortResponse,
  MilestoneEndpoint,
  MilestoneSearchResponse,
} from '@lyvely/common';
import { MilestonesService } from '@/milestones/services';
import { Body, Get, Inject, Post, Query, Request, ValidationPipe } from '@nestjs/common';
import { ProfileRequest } from '@/profiles';
import { Policies } from '@/policies';
import { MilestonesCalendarPlanService } from '@/milestones/services/milestones-calendar-plan.service';

@ContentTypeController(ENDPOINT_MILESTONES, MilestoneModel.contentType)
export class MilestonesController
  extends AbstractContentTypeController<
    Milestone,
    CreateMilestoneModel,
    UpdateMilestoneModel,
    MilestoneModel
  >
  implements MilestoneEndpoint
{
  @Inject()
  protected contentService: MilestonesService;

  @Inject()
  protected calendarPlanService: MilestonesCalendarPlanService;

  protected createModelType = CreateMilestoneModel;
  protected updateModelType = UpdateMilestoneModel;
  protected updateResponseType = UpdateMilestoneResponse;

  @Get()
  async getByFilter(
    @Query(new ValidationPipe({ transform: true })) filter: CalendarPlanFilter,
    @Request() req: ProfileRequest,
  ): Promise<MilestoneSearchResponse> {
    const { profile, user } = req;

    const { models, relations } = await this.calendarPlanService.findMilestonesWithRelations(
      profile,
      user,
      filter,
    );

    return new MilestoneSearchResponse({
      models: models.map((m) => m.toModel()),
      relations,
    });
  }

  @Post(':cid/sort')
  @Policies(ContentWritePolicy)
  async sort(@Body() dto: CalendarPlanSort, @Request() req: ProfileContentRequest<Milestone>) {
    const { profile, user, content } = req;

    const sort = await this.calendarPlanService.sort(
      profile,
      user,
      content,
      dto.interval,
      dto.attachToId,
    );
    return new SortResponse({ sort });
  }
}
