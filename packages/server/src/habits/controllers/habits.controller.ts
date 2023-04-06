import { Post, Body, Request, Inject, Get, Query, ValidationPipe } from '@nestjs/common';
import { Habit } from '../schemas';
import {
  UpdateHabitDataPointModel,
  UpdateHabitDataPointResponse,
  UpdateHabitResponse,
  CreateHabitModel,
  HabitsEndpoint,
  TimerUpdateModel,
  UpdateHabitModel,
  NumberDataPointModel,
  CalendarPlanFilter,
  HabitSearchResponse,
  CalendarPlanSort,
  SortResponse,
} from '@lyvely/common';
import { HabitsService, HabitDataPointService, HabitTimeSeriesService } from '../services';
import {
  ProfileContentRequest,
  ContentTypeController,
  ContentWritePolicy,
  AbstractContentTypeController,
} from '@/content';
import { Policies } from '@/policies';
import { UseClassSerializer } from '@/core';
import { DataPointModelConverter } from '@/time-series';
import { ProfileRequest } from '@/profiles';

@ContentTypeController('habits', Habit)
// TODO: implement feature registration @Feature('habits')
@UseClassSerializer()
export class HabitsController
  extends AbstractContentTypeController<Habit, CreateHabitModel, UpdateHabitModel>
  implements HabitsEndpoint
{
  @Inject()
  protected contentService: HabitsService;

  @Inject()
  protected dataPointService: HabitDataPointService;

  @Inject()
  protected timeSeriesService: HabitTimeSeriesService;

  protected updateResponseType = UpdateHabitResponse;

  protected createModelType = CreateHabitModel;

  protected updateModelType = UpdateHabitModel;

  @Get()
  async getByFilter(
    @Query(new ValidationPipe({ transform: true })) filter: CalendarPlanFilter,
    @Request() req: ProfileRequest,
  ): Promise<HabitSearchResponse> {
    const { profile, user } = req;
    const { models, dataPoints } = await this.timeSeriesService.findTimeSeries(
      profile,
      user,
      filter,
    );
    return new HabitSearchResponse({
      models: models.map((c) => c.toModel()),
      dataPoints: dataPoints.map((value) =>
        DataPointModelConverter.toModel<NumberDataPointModel>(value),
      ),
    });
  }

  @Post(':cid/sort')
  @Policies(ContentWritePolicy)
  async sort(@Body() dto: CalendarPlanSort, @Request() req: ProfileContentRequest<Habit>) {
    const { profile, user, content } = req;
    const sort = await this.timeSeriesService.sort(
      profile,
      user,
      content,
      dto.interval,
      dto.attachToId,
    );
    return new SortResponse({ sort });
  }

  @Post(':cid/update-data-point')
  @Policies(ContentWritePolicy)
  async updateDataPoint(
    @Body() dto: UpdateHabitDataPointModel,
    @Request() req: ProfileContentRequest<Habit>,
  ) {
    const { profile, user, content } = req;

    const { dataPoint } = await this.dataPointService.upsertDataPoint(
      profile,
      user,
      content,
      dto.date,
      dto.value,
    );

    return new UpdateHabitDataPointResponse({
      score: profile.score,
      dataPoint: DataPointModelConverter.toModel<NumberDataPointModel>(dataPoint),
    });
  }

  @Post(':cid/start-timer')
  @Policies(ContentWritePolicy)
  async startTimer(@Body() dto: TimerUpdateModel, @Request() req: ProfileContentRequest<Habit>) {
    const { profile, user, content } = req;
    return null;
    //const dataPoint = await this.dataPointService.startTimer(profile, user, content, dto.date);
    // return DataPointModelConverter.toModel<NumberDataPointModel>(dataPoint);
  }

  @Post(':cid/stop-timer')
  @Policies(ContentWritePolicy)
  async stopTimer(@Body() dto: TimerUpdateModel, @Request() req: ProfileContentRequest<Habit>) {
    const { profile, user, content } = req;
    return null;

    // const dataPoint = await this.dataPointService.stopTimer(profile, user, content, dto.date);

    //  return new UpdateHabitDataPointResponse({
    //   score: profile.score,
    //  dataPoint: DataPointModelConverter.toModel<NumberDataPointModel>(dataPoint),
    //});
  }
}
