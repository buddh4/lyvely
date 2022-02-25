import {
  Post,
  Param,
  Body,
  Request,
  InternalServerErrorException,
} from '@nestjs/common';
import { Habit } from '../schemas';
import {
  EditHabitDto,
  HabitDto,
  UpdateActivityLogModel,
  UpdateHabitResultDto,
} from 'lyvely-common';
import { HabitsService } from '../services/habits.service';
import { ActivityDataPointService } from '../services/activity-data-point.service';
import { AbstractContentController } from '../../content/controllers/abstract-content.controller';
import { UserProfileRequest } from '../../core/types';
import { ProfileContentRequest } from '../../content/controllers/profile-content-request.type';
import { Permissions } from '../../permissions/decorators/permissions.decorator';
import { UseClassSerializer } from '../../core/decorators/use-class-serializer.decorator';
import { ContentWritePolicy } from '../../content/policies/content-write.policy';
import { Policies } from '../../policies/decorators/policies.decorator';
import { ActivityPermissions } from '../permissions';
import { ContentController } from '../../content/decorators/profile.content.controller.decorator';
import { ContentType } from '../../content/decorators/content-type.decorator';
import { Feature } from '../../core/features/feature.decorator';

@UseClassSerializer()
@ContentController('habits')
@Feature('content.activities.habits')
@ContentType(Habit)
export class HabitsController extends AbstractContentController<Habit> {

  constructor(
    protected contentService: HabitsService,
    protected activitiesLogsService: ActivityDataPointService) {
    super(contentService);
  }

  @Post()
  @Permissions(ActivityPermissions.CREATE)
  async create(@Request() req: UserProfileRequest, @Body() dto: EditHabitDto) {
    const { profile, user } = req;

    const habitModel = await this.contentService.createContent(profile, Habit.create(user, profile, dto));

    if (!habitModel) {
      throw new InternalServerErrorException();
    }

    return new HabitDto(habitModel);
  }

  @Post(':cid')
  @Policies(ContentWritePolicy)
  async update(@Request() req: ProfileContentRequest, @Param('cid') id, @Body() dto: EditHabitDto) {
    const { profile, user, content } = req;

    const updated = Habit.create(user, profile, dto);
    await this.contentService.updateContent(profile, new Habit(content), updated);
    updated._id = id;

    // TODO: update may not be a complete habit model...
    return new HabitDto(updated);
  }

  @Post(':id/update-log')
  @Policies(ContentWritePolicy)
  async updateLog(@Request() req: ProfileContentRequest, @Param('cid') id, @Body() dto: UpdateActivityLogModel,) {
    const { profile, user, content } = req;
    const habit = new Habit(content);
    const log = await this.activitiesLogsService.updateLog(user, profile, habit, dto.date, dto.value);

    return new UpdateHabitResultDto({
      score: profile.score,
      value: log.score,
      units: log.value,
    });
  }
}
