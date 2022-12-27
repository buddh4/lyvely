import { Post, Body, Request, Put } from '@nestjs/common';
import { Habit } from '../schemas';
import {
  UpdateHabitDto,
  UpdateDataPointDto,
  UpdateHabitDataPointResultDto,
  UpdateHabitResponseDto,
  HabitModel,
  TagModel,
  CreateHabitDto,
  HabitsEndpoint,
  TimerUpdate,
} from '@lyvely/common';
import { HabitsService } from '../services/habits.service';
import { HabitDataPointService } from '../services/habit-data-point.service';
import { ProfileContentRequest, ContentController, ContentWritePolicy } from '@/content';
import { ProfileRequest, ProfilePermissions } from '@/profiles';
import { Policies } from '@/policies/decorators/policies.decorator';
import { ActivityPermissions } from '../permissions';
import { UseClassSerializer } from '@/core';

@ContentController('habits', Habit)
// TODO: implement feature registration @Feature('content.activities.habits')F
@UseClassSerializer()
export class HabitsController implements HabitsEndpoint {
  constructor(
    protected contentService: HabitsService,
    protected habitDataPointService: HabitDataPointService,
  ) {}

  @Post()
  @ProfilePermissions(ActivityPermissions.CREATE)
  async create(@Body() dto: CreateHabitDto, @Request() req: ProfileRequest) {
    const { profile, user } = req;

    const habitModel = await this.contentService.createContent(profile, user, dto);

    return new UpdateHabitResponseDto({
      model: new HabitModel(habitModel),
      tags: profile.getNewTags().map((tag) => new TagModel(tag)),
    });
  }

  @Put(':cid')
  @Policies(ContentWritePolicy)
  async update(@Body() update: UpdateHabitDto, @Request() req: ProfileContentRequest<Habit>) {
    const { profile, user, content } = req;

    content.applyUpdate(update);
    await this.contentService.updateContent(profile, user, content, content);

    return new UpdateHabitResponseDto({
      model: new HabitModel(content),
      tags: profile.getNewTags().map((tag) => new TagModel(tag)),
    });
  }

  @Post(':cid/update-data-point')
  @Policies(ContentWritePolicy)
  async updateDataPoint(
    @Body() dto: UpdateDataPointDto,
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
