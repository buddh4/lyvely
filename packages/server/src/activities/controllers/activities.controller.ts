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
  DataPointIntervalFilter
} from 'lyvely-common';

import { ActivitiesService } from '../services/activities.service';
import { AbstractContentController, ContentController } from '../../content';
import { Activity } from '../schemas';
import { UserProfileRequest } from '../../core/types';
import { Feature } from '../../core/features/feature.decorator';

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
    @Request() req: UserProfileRequest,
    @Query(new ValidationPipe({ transform: false })) filter: DataPointIntervalFilter,
  ): Promise<IActivityRangeResponse> {
    const { profile, user } = req;

    // TODO: (Optimization) Currently we only need to load habits and undone tasks on first load
    const { activities, dataPoints } = await this.contentService.findByFilter(profile, user, filter);

    const result = new ActivityRangeResponseDto();
    result.addActivities(activities);
    result.addDataPoints(dataPoints.map((value) => value.createDto()));
    return result;
  }

  @Post(':cid/sort')
  async sort(@Request() req, @Param('id') activityId, @Body() dto: MoveActivityDto) {
    await this.contentService.sort(req.user, activityId, dto.newIndex);
    return;
  }
}
