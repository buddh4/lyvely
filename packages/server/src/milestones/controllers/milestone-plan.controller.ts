import { ContentTypeController, ContentWritePolicy, ProfileContentRequest } from '@/content';
import { Milestone } from '@/milestones/schemas';
import {
  MilestoneModel,
  ENDPOINT_MILESTONE_PLAN,
  CalendarPlanSort,
  SortResponse,
  MilestoneSearchResponse,
  MilestonePlanEndpoint,
  CalendarPlanFilter,
} from '@lyvely/common';
import { MilestonesService } from '@/milestones/services';
import { Body, Get, Inject, Post, Query, Request, ValidationPipe } from '@nestjs/common';
import { ProfileRequest } from '@/profiles';
import { Policies } from '@/policies';
import { MilestonesCalendarPlanService } from '@/milestones/services/milestones-calendar-plan.service';

@ContentTypeController(ENDPOINT_MILESTONE_PLAN, MilestoneModel.contentType)
export class MilestonePlanController implements MilestonePlanEndpoint {
  @Inject()
  protected contentService: MilestonesService;

  @Inject()
  protected calendarPlanService: MilestonesCalendarPlanService;

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
