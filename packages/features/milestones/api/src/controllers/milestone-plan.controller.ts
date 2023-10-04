import { ContentTypeController, ContentWritePolicy, ProfileContentRequest } from '@lyvely/content';
import { Milestone } from '../schemas';
import {
  MilestoneModel,
  ENDPOINT_MILESTONE_PLAN,
  MilestonePlanEndpoint,
  MilestoneSearchResponse,
  MilestoneRelationModel,
} from '@lyvely/milestones-interface';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan-interface';
import { SortResponse } from '@lyvely/common';
import { MilestonesService, MilestonesCalendarPlanService } from '../services';
import { Body, Get, Inject, Post, Query, Request, ValidationPipe } from '@nestjs/common';
import { ProfileRequest } from '@lyvely/profiles';
import { Policies } from '@lyvely/policies';

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
      relations: relations as MilestoneRelationModel<any>[],
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
