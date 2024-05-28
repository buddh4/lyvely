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
  HabitsEndpoints,
  ENDPOINT_HABITS,
} from '@lyvely/habits-interface';
import { TimerUpdateModel } from '@lyvely/timers';
import {
  TimerDataPointModel,
  NumberDataPointModel,
  DataPointModelConverter,
} from '@lyvely/time-series';
import {
  SortResponse,
  Policies,
  ContentTypeController,
  ContentWritePolicy,
  AbstractContentTypeController,
  ProtectedProfileContentRequest,
  UseClassSerializer,
  ProfileRequest,
} from '@lyvely/api';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan';
import { HabitsService, HabitTimeSeriesService, HabitDataPointTimerService } from '../services';

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
    @Request() req: ProfileRequest
  ): Promise<HabitSearchResponse> {
    const { context } = req;
    const { models, dataPoints } = await this.timeSeriesService.findTimeSeries(context, filter);
    return new HabitSearchResponse({
      models: models.map<HabitModel<any>>((c) => c.toModel()),
      dataPoints: dataPoints.map((value) =>
        DataPointModelConverter.toModel<NumberDataPointModel>(value)
      ),
    });
  }

  @Post(HabitsEndpoints.SORT(':cid'))
  @Policies(ContentWritePolicy)
  async sort(@Body() dto: CalendarPlanSort, @Request() req: ProtectedProfileContentRequest<Habit>) {
    const { context, content } = req;
    const sort = await this.timeSeriesService.sort(context, content, dto.interval, dto.attachToId);
    return new SortResponse({ sort });
  }

  @Post(HabitsEndpoints.UPDATE_DATA_POINT(':cid'))
  @Policies(ContentWritePolicy)
  async updateDataPoint(
    @Body() dto: UpdateHabitDataPointModel,
    @Request() req: ProtectedProfileContentRequest<Habit>
  ) {
    const { context, profile, content } = req;

    const { dataPoint } = await this.timeSeriesService.upsertDataPoint(
      context,
      content,
      dto.date,
      dto.value
    );

    return new UpdateHabitDataPointResponse({
      score: profile.score,
      model: content.toModel() as HabitModel<any>,
      dataPoint: DataPointModelConverter.toModel<NumberDataPointModel>(dataPoint),
    });
  }

  @Post(HabitsEndpoints.START_TIMER(':cid'))
  @Policies(ContentWritePolicy)
  async startTimer(
    @Body() dto: TimerUpdateModel,
    @Request() req: ProtectedProfileContentRequest<Habit>
  ): Promise<TimerDataPointModel> {
    const { context, content } = req;
    const dataPoint = await this.timerService.startTimer(context, content, dto.date);
    return DataPointModelConverter.toModel<TimerDataPointModel>(dataPoint);
  }

  @Post(HabitsEndpoints.STOP_TIMER(':cid'))
  @Policies(ContentWritePolicy)
  async stopTimer(
    @Body() dto: TimerUpdateModel,
    @Request() req: ProtectedProfileContentRequest<Habit>
  ): Promise<UpdateHabitDataPointTimerResponse> {
    const { context, content } = req;

    const dataPoint = await this.timerService.stopTimer(context, content, dto.date);

    return new UpdateHabitDataPointTimerResponse({
      score: context.profile.score,
      dataPoint: DataPointModelConverter.toModel<TimerDataPointModel>(dataPoint),
    });
  }
}
