import {
  Post,
  Param,
  Body,
  Request,
  Put
} from '@nestjs/common';
import { Habit } from '../schemas';
import {
  UpdateHabitDto,
  UpdateDataPointDto,
  UpdateDataPointResultDto,
  UpdateHabitResponseDto,
  HabitModel,
  TagModel } from '@lyvely/common';
import { HabitsService } from '../services/habits.service';
import { HabitDataPointService } from '../services/habit-data-point.service';
import { AbstractContentController, ProfileContentRequest,  ContentController, ContentType, ContentWritePolicy } from '../../content';
import { ProfileRequest } from '../../../core/types';
import { Permissions } from '../../permissions/decorators/permissions.decorator';
import { UseClassSerializer } from '../../../core/decorators/use-class-serializer.decorator';
import { Policies } from '../../policies/decorators/policies.decorator';
import { ActivityPermissions } from '../permissions';
import { EntityNotFoundException } from "../../../core/exceptions";
import { isHabitContent } from "../utils/activity.utils";

@ContentController('habits')
// TODO: implement feature registration @Feature('content.activities.habits')
@ContentType(Habit)
@UseClassSerializer()
export class HabitsController extends AbstractContentController<Habit> {

  constructor(
    protected contentService: HabitsService,
    protected habitDataPointService: HabitDataPointService) {
    super(contentService);
  }

  @Post()
  @Permissions(ActivityPermissions.CREATE)
  async create(@Request() req: ProfileRequest, @Body() dto: UpdateHabitDto) {
    const { profile, user } = req;

    const habitModel = await this.contentService.createContent(profile, user, Habit.create(profile, user, dto), dto.tagNames);

    if (!habitModel) {
      throw new EntityNotFoundException();
    }

    return new UpdateHabitResponseDto({
      model: new HabitModel(habitModel),
      tags: profile.getNewTags().map(tag => new TagModel(tag))
    });
  }

  @Put(':cid')
  @Policies(ContentWritePolicy)
  async update(@Request() req: ProfileContentRequest, @Param('cid') id, @Body() update: UpdateHabitDto) {
    const { profile, user, content } = req;


    if(!isHabitContent(content)) {
      throw new EntityNotFoundException();
    }

    await this.contentService.updateHabit(profile, user, content, update);

    return new UpdateHabitResponseDto({
      model: new HabitModel(content),
      tags: profile.getNewTags().map(tag => new TagModel(tag))
    });
  }

  @Post(':id/update-log')
  @Policies(ContentWritePolicy)
  async updateDataPoint(@Request() req: ProfileContentRequest, @Param('cid') id, @Body() dto: UpdateDataPointDto) {
    const { profile, user, content } = req;

    if(!isHabitContent(content)) {
      throw new EntityNotFoundException();
    }

    const dataPoint = await this.habitDataPointService.upsertDataPoint(profile, user, content as Habit, dto.date, dto.value);

    return new UpdateDataPointResultDto({
      score: profile.score,
      units: dataPoint.value,
    });
  }
}
