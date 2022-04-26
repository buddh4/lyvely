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
import { TimeSeriesRangeFilter ,
  ActivityRangeResponseDto,
  IActivityRangeResponse,
  MoveActivityDto,
} from 'lyvely-common';

import { ActivitiesService } from '../services/activities.service';
import { AbstractContentController } from '../../content';
import { Activity } from '../schemas';
import { UserProfileRequest } from '../../core/types';
import { Feature } from '../../core/features/feature.decorator';
import { ContentController } from '../../profiles';

@ContentController('activities')
@Feature('activities')
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
  async findByRange(
    @Request() req: UserProfileRequest,
    @Query(new ValidationPipe({ transform: true })) filter: TimeSeriesRangeFilter,
  ): Promise<IActivityRangeResponse> {
    const { profile } = req;
    const { activities, logs } = await this.contentService.findByFilter(profile, filter);

    const result = new ActivityRangeResponseDto();
    result.addActivities(activities);
    result.addActivityLogs(logs);
    return result;
  }

  @Post(':cid/sort')
  async sort(@Request() req, @Param('id') activityId, @Body() dto: MoveActivityDto) {
    await this.contentService.sort(req.user, activityId, dto.newIndex);
    return;
  }
}
