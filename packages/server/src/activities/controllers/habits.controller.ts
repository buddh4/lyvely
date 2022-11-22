import { Post, Param, Body, Request, Put } from '@nestjs/common';
import { Habit } from '../schemas';
import {
  UpdateHabitDto,
  UpdateDataPointDto,
  UpdateHabitDataPointResultDto,
  UpdateHabitResponseDto,
  HabitModel,
  TagModel,
  EntityNotFoundException,
  CreateHabitDto,
  HabitsEndpoint,
  TimerUpdate,
} from '@lyvely/common';
import { HabitsService } from '../services/habits.service';
import { HabitDataPointService } from '../services/habit-data-point.service';
import { ProfileContentRequest, ContentController, ContentType, ContentWritePolicy } from '@/content';
import { ProfileRequest, ProfilePermissions } from '@/profiles';
import { Policies } from '@/policies/decorators/policies.decorator';
import { ActivityPermissions } from '../permissions';
import { UseClassSerializer } from '@/core';

@ContentController('habits')
// TODO: implement feature registration @Feature('content.activities.habits')
@ContentType(Habit)
@UseClassSerializer()
export class HabitsController implements HabitsEndpoint {
  constructor(protected contentService: HabitsService, protected habitDataPointService: HabitDataPointService) {}

  @Post()
  @ProfilePermissions(ActivityPermissions.CREATE)
  async create(@Body() dto: CreateHabitDto, @Request() req: ProfileRequest) {
    const { profile, user } = req;

    const habitModel = await this.contentService.createHabit(profile, user, dto);

    return new UpdateHabitResponseDto({
      model: new HabitModel(habitModel),
      tags: profile.getNewTags().map((tag) => new TagModel(tag)),
    });
  }

  @Put(':cid')
  @Policies(ContentWritePolicy)
  async update(@Body() update: UpdateHabitDto, @Request() req: ProfileContentRequest<Habit>, @Param('cid') id: string) {
    const { profile, user, content } = req;

    await this.contentService.updateHabit(profile, user, content, update);

    return new UpdateHabitResponseDto({
      model: new HabitModel(content),
      tags: profile.getNewTags().map((tag) => new TagModel(tag)),
    });
  }

  @Post(':cid/update-data-point')
  @Policies(ContentWritePolicy)
  async updateDataPoint(@Body() dto: UpdateDataPointDto, @Request() req: ProfileContentRequest<Habit>) {
    const { profile, user, content } = req;

    const dataPoint = await this.habitDataPointService.upsertDataPoint(profile, user, content, dto.date, dto.value);

    return new UpdateHabitDataPointResultDto({
      score: profile.score,
      dataPoint: dataPoint.createDto(),
    });
  }

  @Post(':cid/start-timer')
  @Policies(ContentWritePolicy)
  async startTimer(@Body() dto: TimerUpdate, @Request() req: ProfileContentRequest<Habit>) {
    const { profile, user, content } = req;

    const dataPoint = await this.habitDataPointService.startTimer(profile, user, content, dto.date);
    return dataPoint.createDto();
  }

  @Post(':cid/stop-timer')
  @Policies(ContentWritePolicy)
  async stopTimer(@Body() dto: TimerUpdate, @Request() req: ProfileContentRequest<Habit>) {
    const { profile, user, content } = req;

    const dataPoint = await this.habitDataPointService.stopTimer(profile, user, content, dto.date);

    return new UpdateHabitDataPointResultDto({
      score: profile.score,
      dataPoint: dataPoint.createDto(),
    });
  }
}
