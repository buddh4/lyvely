import { Post, Body, Request, Inject, Get, Query, ValidationPipe } from '@nestjs/common';
import { Habit } from '../schemas';
import {
  UpdateHabitDataPointModel,
  UpdateHabitDataPointResponse,
  UpdateHabitResponse,
  CreateHabitModel,
  HabitsEndpoint,
  UpdateHabitModel,
  HabitSearchResponse,
  UpdateHabitDataPointTimerResponse,
  HabitModel,
  HabitsEndpointPaths,
  ENDPOINT_HABITS,
} from '@lyvely/habits-interface';
import { TimerUpdateModel } from '@lyvely/timers';
import {
  TimerDataPointModel,
  NumberDataPointModel,
  DataPointModelConverter,
} from '@lyvely/time-series';
import { SortResponse } from '@lyvely/common';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan';
import { HabitsService, HabitTimeSeriesService, HabitDataPointTimerService } from '../services';
import {
  Policies,
  ContentTypeController,
  ContentWritePolicy,
  AbstractContentTypeController,
  ProtectedProfileContentRequest,
  UseClassSerializer,
  ProfileRequest,
} from '@lyvely/api';

@ContentTypeController(ENDPOINT_HABITS, Habit)
// TODO: implement feature registration @Feature('habits')
@UseClassSerializer()
export class HabitsController
  extends AbstractContentTypeController<Habit, CreateHabitModel, UpdateHabitModel>
  implements HabitsEndpoint
{
  @Inject()
  protected contentService: HabitsService;

  @Inject()
  protected timeSeriesService: HabitTimeSeriesService;

  @Inject()
  protected timerService: HabitDataPointTimerService;

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
      models: models.map<HabitModel<any>>((c) => c.toModel()),
      dataPoints: dataPoints.map((value) =>
        DataPointModelConverter.toModel<NumberDataPointModel>(value),
      ),
    });
  }

  @Post(HabitsEndpointPaths.SORT(':cid'))
  @Policies(ContentWritePolicy)
  async sort(@Body() dto: CalendarPlanSort, @Request() req: ProtectedProfileContentRequest<Habit>) {
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

  @Post(HabitsEndpointPaths.UPDATE_DATA_POINT(':cid'))
  @Policies(ContentWritePolicy)
  async updateDataPoint(
    @Body() dto: UpdateHabitDataPointModel,
    @Request() req: ProtectedProfileContentRequest<Habit>,
  ) {
    const { profile, user, content } = req;

    const { dataPoint } = await this.timeSeriesService.upsertDataPoint(
      profile,
      user,
      content,
      dto.date,
      dto.value,
    );

    return new UpdateHabitDataPointResponse({
      score: profile.score,
      model: content.toModel() as HabitModel<any>,
      dataPoint: DataPointModelConverter.toModel<NumberDataPointModel>(dataPoint),
    });
  }

  @Post(HabitsEndpointPaths.START_TIMER(':cid'))
  @Policies(ContentWritePolicy)
  async startTimer(
    @Body() dto: TimerUpdateModel,
    @Request() req: ProtectedProfileContentRequest<Habit>,
  ) {
    const { profile, user, content } = req;
    const dataPoint = await this.timerService.startTimer(profile, user, content, dto.date);
    return DataPointModelConverter.toModel<TimerDataPointModel>(dataPoint);
  }

  @Post(HabitsEndpointPaths.STOP_TIMER(':cid'))
  @Policies(ContentWritePolicy)
  async stopTimer(
    @Body() dto: TimerUpdateModel,
    @Request() req: ProtectedProfileContentRequest<Habit>,
  ) {
    const { profile, user, content } = req;

    const dataPoint = await this.timerService.stopTimer(profile, user, content, dto.date);

    return new UpdateHabitDataPointTimerResponse({
      score: profile.score,
      dataPoint: DataPointModelConverter.toModel<TimerDataPointModel>(dataPoint),
    });
  }
}
