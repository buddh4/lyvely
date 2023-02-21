import { Post, Body, Request, Inject } from '@nestjs/common';
import { Habit } from '../schemas';
import {
  UpdateHabitDataPointModel,
  UpdateHabitDataPointResponse,
  UpdateHabitResponse,
  CreateHabitModel,
  HabitsEndpoint,
  TimerUpdateModel,
  UpdateHabitModel,
} from '@lyvely/common';
import { HabitsService } from '../services/habits.service';
import { HabitDataPointService } from '../services/habit-data-point.service';
import {
  ProfileContentRequest,
  ContentTypeController,
  ContentWritePolicy,
  AbstractContentTypeController,
} from '@/content';
import { Policies } from '@/policies/decorators/policies.decorator';
import { UseClassSerializer } from '@/core';

@ContentTypeController('habits', Habit)
// TODO: implement feature registration @Feature('content.activities.habits')F
@UseClassSerializer()
export class HabitsController
  extends AbstractContentTypeController<Habit, CreateHabitModel, UpdateHabitModel>
  implements HabitsEndpoint
{
  @Inject()
  protected contentService: HabitsService;

  @Inject()
  protected habitDataPointService: HabitDataPointService;

  protected updateResponseType = UpdateHabitResponse;

  protected createModelType = CreateHabitModel;

  protected updateModelType = UpdateHabitModel;

  @Post(':cid/update-data-point')
  @Policies(ContentWritePolicy)
  async updateDataPoint(
    @Body() dto: UpdateHabitDataPointModel,
    @Request() req: ProfileContentRequest<Habit>,
  ) {
    const { profile, user, content } = req;

    const dataPoint = await this.habitDataPointService.upsertDataPoint(
      profile,
      user,
      content,
      dto.date,
      dto.value,
    );

    return new UpdateHabitDataPointResponse({
      score: profile.score,
      dataPoint: dataPoint.toModel(),
    });
  }

  @Post(':cid/start-timer')
  @Policies(ContentWritePolicy)
  async startTimer(@Body() dto: TimerUpdateModel, @Request() req: ProfileContentRequest<Habit>) {
    const { profile, user, content } = req;

    const dataPoint = await this.habitDataPointService.startTimer(profile, user, content, dto.date);
    return dataPoint.toModel();
  }

  @Post(':cid/stop-timer')
  @Policies(ContentWritePolicy)
  async stopTimer(@Body() dto: TimerUpdateModel, @Request() req: ProfileContentRequest<Habit>) {
    const { profile, user, content } = req;

    const dataPoint = await this.habitDataPointService.stopTimer(profile, user, content, dto.date);

    return new UpdateHabitDataPointResponse({
      score: profile.score,
      dataPoint: dataPoint.toModel(),
    });
  }
}
