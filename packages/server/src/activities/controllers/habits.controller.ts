import {
  Post,
  Param,
  Body,
  Request,
} from '@nestjs/common';
import { Habit } from '../schemas';
import {
  EditHabitDto,
  HabitDto,
  UpdateActivityLogModel,
  UpdateHabitResultDto,
  isHabit,
} from 'lyvely-common';
import { HabitsService } from '../services/habits.service';
import { HabitDataPointService } from '../services/habit-data-point.service';
import { AbstractContentController, ProfileContentRequest,  ContentController, ContentType, ContentWritePolicy } from '../../content';
import { UserProfileRequest } from '../../core/types';
import { Permissions } from '../../permissions/decorators/permissions.decorator';
import { UseClassSerializer } from '../../core/decorators/use-class-serializer.decorator';
import { Policies } from '../../policies/decorators/policies.decorator';
import { ActivityPermissions } from '../permissions';
import { Feature } from '../../core/features/feature.decorator';
import { EntityNotFoundException } from "../../core/exceptions";

@UseClassSerializer()
@ContentController('habits')
@Feature('content.activities.habits')
@ContentType(Habit)
export class HabitsController extends AbstractContentController<Habit> {

  constructor(
    protected contentService: HabitsService,
    protected habitDataPointService: HabitDataPointService) {
    super(contentService);
  }

  @Post()
  @Permissions(ActivityPermissions.CREATE)
  async create(@Request() req: UserProfileRequest, @Body() dto: EditHabitDto) {
    const { profile, user } = req;

    const habitModel = await this.contentService.createContent(profile, user, Habit.create(user, profile, dto));

    if (!habitModel) {
      throw new EntityNotFoundException();
    }

    return new HabitDto(habitModel);
  }

  @Post(':cid')
  @Policies(ContentWritePolicy)
  async update(@Request() req: ProfileContentRequest, @Param('cid') id, @Body() dto: EditHabitDto) {
    const { profile, user, content } = req;

    if(!isHabit(content)) {
      throw new EntityNotFoundException();
    }

    const updated = await this.contentService.findContentAndUpdate(profile, user, content as Habit, Habit.create(user, profile, dto));
    return new HabitDto(updated);
  }

  @Post(':id/update-log')
  @Policies(ContentWritePolicy)
  async updateLog(@Request() req: ProfileContentRequest, @Param('cid') id, @Body() dto: UpdateActivityLogModel) {
    const { profile, user, content } = req;

    if(!isHabit(content)) {
      throw new EntityNotFoundException();
    }

    const dataPoint = await this.habitDataPointService.upsertDataPoint(profile, user, content as Habit, dto.date, dto.value);

    return new UpdateHabitResultDto({
      score: profile.score,
      units: dataPoint.value,
    });
  }
}
