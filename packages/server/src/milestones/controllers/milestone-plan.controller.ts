import {
  AbstractContentTypeController,
  ContentReadPolicy,
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
  ENDPOINT_MILESTONE_PLAN,
  CalendarPlanSort,
  SortResponse,
  MilestonesEndpoint,
  MilestoneSearchResponse,
  MilestonePlanSearchFilter,
  MilestonePlanEndpoint,
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
    @Query(new ValidationPipe({ transform: true })) filter: MilestonePlanSearchFilter,
    @Request() req: ProfileRequest,
  ): Promise<MilestoneSearchResponse> {
    const { profile, user } = req;

    if (filter.withRelations === false) {
      const models = await this.calendarPlanService.findByFilter(profile, user, filter);
      return new MilestoneSearchResponse({
        models: models.map((m) => m.toModel()),
      });
    }

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
