import {
  Get,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
  Query,
  ValidationPipe,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import {
  ActivityRangeResponseDto,
  IActivityRangeResponse,
  MoveActivityDto,
  DataPointIntervalFilter,
  TaskDto,
  HabitDto
} from '@lyvely/common';

import { ActivitiesService } from '../services/activities.service';
import { AbstractContentController, ContentController } from '../../content';
import { Activity } from '../schemas';
import { ProfileRequest } from '../../core/types';
import { isTaskContent } from "../utils/activity.utils";

@ContentController('activities')
// TODO: implement feature registration @Feature('activities')
@UseInterceptors(ClassSerializerInterceptor)
export class ActivitiesController extends AbstractContentController<Activity> {

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
    @Query(new ValidationPipe({ transform: false })) filter: DataPointIntervalFilter,
  ): Promise<IActivityRangeResponse> {
    const { profile, user } = req;

    // TODO: (Optimization) Currently we only need to load habits and undone tasks on first load
    const { activities, dataPoints } = await this.contentService.findByFilter(profile, user, filter);

    const result = new ActivityRangeResponseDto();
    activities.forEach(activity => {
      let dto;
      if(isTaskContent(activity)) {
        dto = new TaskDto(activity);
        dto.done = activity.getDoneBy(user)?.tid;
      } else {
        dto = new HabitDto(activity);
      }
      result.addActivity(dto);
    });
    result.addDataPoints(dataPoints.map((value) => value.createDto()));
    return result;
  }

  @Post(':cid/sort')
  async sort(@Request() req, @Param('id') activityId, @Body() dto: MoveActivityDto) {
    await this.contentService.sort(req.user, activityId, dto.newIndex);
    return;
  }
}
