import { Get, Request, Inject, Query, ValidationPipe, Post, Body } from '@nestjs/common';
import {
  ActivitySearchResponse,
  DataPointIntervalFilter,
  MoveAction,
  ENDPOINT_ACTIVITIES,
  ActivityEndpoint,
  SortResponse,
} from '@lyvely/common';
import { ActivitiesService } from '../services/activities.service';
import { ContentTypeController, ContentWritePolicy, ProfileContentRequest } from '@/content';
import { Activity } from '../schemas';
import { ProfileRequest } from '@/profiles';
import { Policies } from '@/policies';
import { UseClassSerializer } from '@/core';

@ContentTypeController(ENDPOINT_ACTIVITIES)
// TODO: implement feature registration @Feature('activities')
@UseClassSerializer()
export class ActivitiesController implements ActivityEndpoint {
  @Inject()
  protected contentService: ActivitiesService;

  @Get()
  async getByFilter(
    @Query(new ValidationPipe({ transform: true })) filter: DataPointIntervalFilter,
    @Request() req: ProfileRequest,
  ): Promise<ActivitySearchResponse> {
    const { profile, user } = req;
    const { models, dataPoints } = await this.contentService.findByFilter(profile, user, filter);
    return new ActivitySearchResponse({
      models: models.map((c) => c.toModel(user)),
      dataPoints: dataPoints.map((value) => value.toModel()),
    });
  }

  @Post(':cid/sort')
  @Policies(ContentWritePolicy)
  async sort(@Body() dto: MoveAction, @Request() req: ProfileContentRequest<Activity>) {
    const { profile, user, content } = req;
    const sort = await this.contentService.sort(
      profile,
      user,
      content,
      dto.interval,
      dto.attachToId,
    );
    return new SortResponse({ sort });
  }
}
