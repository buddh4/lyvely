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
  ContentController,
  ContentWritePolicy,
  AbstractContentController,
} from '@/content';
import { Policies } from '@/policies/decorators/policies.decorator';
import { UseClassSerializer } from '@/core';

@ContentController('habits', Habit)
// TODO: implement feature registration @Feature('content.activities.habits')F
@UseClassSerializer()
export class HabitsController
  extends AbstractContentController<Habit, CreateHabitModel, UpdateHabitModel>
  implements HabitsEndpoint
{
  @Inject()
  protected contentService: HabitsService;

  @Inject()
  protected habitDataPointService: HabitDataPointService;

  protected updateResponseType = UpdateHabitResponse;

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
      dataPoint: dataPoint.createDto(),
    });
  }

  @Post(':cid/start-timer')
  @Policies(ContentWritePolicy)
  async startTimer(@Body() dto: TimerUpdateModel, @Request() req: ProfileContentRequest<Habit>) {
    const { profile, user, content } = req;

    const dataPoint = await this.habitDataPointService.startTimer(profile, user, content, dto.date);
    return dataPoint.createDto();
  }

  @Post(':cid/stop-timer')
  @Policies(ContentWritePolicy)
  async stopTimer(@Body() dto: TimerUpdateModel, @Request() req: ProfileContentRequest<Habit>) {
    const { profile, user, content } = req;

    const dataPoint = await this.habitDataPointService.stopTimer(profile, user, content, dto.date);

    return new UpdateHabitDataPointResponse({
      score: profile.score,
      dataPoint: dataPoint.createDto(),
    });
  }
}
