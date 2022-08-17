import {
  Get,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
  Query,
  ValidationPipe,
  Post,
  Body,
} from '@nestjs/common';
import {
  ActivityRangeResponseDto,
  IActivityRangeResponse,
  DataPointIntervalFilter,
  TaskDto,
  HabitDto
, MoveAction, SortResult } from '@lyvely/common';

import { ActivitiesService } from '../services/activities.service';
import { AbstractContentController, ContentController, ContentWritePolicy, ProfileContentRequest } from '../../content';
import { Activity } from '../schemas';
import { ProfileRequest } from '../../core/types';
import { isTaskContent } from "../utils/activity.utils";
import { Policies } from "../../policies/decorators/policies.decorator";

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
  @Policies(ContentWritePolicy)
  async sort(@Request() req: ProfileContentRequest<Activity>, @Body() dto: MoveAction): Promise<SortResult[]> {
    const { profile, user, content } = req;
    return await this.contentService.sort(profile, user, content, dto.interval, dto.attachToId);
  }
}
