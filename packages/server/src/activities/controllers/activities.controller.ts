import { Get, Request, Inject, Query, ValidationPipe, Post, Body } from '@nestjs/common';
import {
  ActivityModel,
  ActivityRangeResponse,
  DataPointIntervalFilter,
  MoveAction,
} from '@lyvely/common';
import { ActivitiesService } from '../services/activities.service';
import { ContentTypeController, ContentWritePolicy, ProfileContentRequest } from '@/content';
import { Activity } from '../schemas';
import { ProfileRequest } from '@/profiles';
import { Policies } from '@/policies';
import { UseClassSerializer } from '@/core';

@ContentTypeController('activities')
// TODO: implement feature registration @Feature('activities')
@UseClassSerializer()
export class ActivitiesController {
  @Inject()
  protected contentService: ActivitiesService;

  /**
   * Finds all activities and logs relevant to the given range filter.
   *
   * @param req
   * @param filter
   */
  @Get()
  async findByFilter(
    @Request() req: ProfileRequest,
    @Query(new ValidationPipe({ transform: true })) filter: DataPointIntervalFilter,
  ): Promise<ActivityRangeResponse> {
    const { profile, user } = req;

    // TODO: (Optimization) Currently we only need to load habits and undone tasks on first load
    const { activities, dataPoints } = await this.contentService.findByFilter(
      profile,
      user,
      filter,
    );

    const result = new ActivityRangeResponse();
    activities.forEach((activity) => {
      result.addActivity(activity.toModel(user) as ActivityModel);
    });

    result.addDataPoints(dataPoints.map((value) => value.createDto()));
    return result;
  }

  @Post(':cid/sort')
  @Policies(ContentWritePolicy)
  async sort(@Request() req: ProfileContentRequest<Activity>, @Body() dto: MoveAction) {
    const { profile, user, content } = req;
    return await this.contentService.sort(profile, user, content, dto.interval, dto.attachToId);
  }
}
