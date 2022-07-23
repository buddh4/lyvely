import {
  Controller,
  Post,
  Param,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Habit, Task, TaskDocument } from '../schemas';
/*import {
  UpdateTaskStateModel,
  DoneTaskResultModel,
  EditTaskModel,
  TaskDto,
} from 'lyvely-common';*/
import { User } from '../../users/schemas/users.schema';
import { TasksService } from '../services/tasks.service';
import { EntityIdentity } from '../../db/db.utils';
import { Profile } from '../../profiles/schemas/profiles.schema';
import { Feature } from '../../core/features/feature.decorator';
import { ContentType } from '../../content/decorators/content-type.decorator';

@Controller('tasks')
@Feature('content.activities.tasks')
@ContentType(Habit)
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController {
  @Inject()
  private readonly tasksService: TasksService;

  /*@Post()
  async create(@Request() req, @Body() dto: EditTaskDto): Promise<TaskDto> {
    const user = req.user;
    const profile = await this.findProfileByUserAndName(user, dto.profile);
    const activity = await this.tasksService.create(user, Task.create(user, profile, dto));

    if (!activity) {
      throw new InternalServerErrorException();
    }

    return new TaskDto(activity);
  }

  @Post(':id')
  async update(
    @Request() req,
    @Param('id') id,
    @Body() dto: EditTaskDto,
  ): Promise<{ success: boolean } | ITask> {
    const task = await this.findTaskById(req.user, id);
    const profile = await this.findProfileByUserAndId(req.user, <EntityIdentity<Profile>>(<unknown>task.profile));
    const updated = Task.create(req.user, profile, dto);
    await this.tasksService.update(profile, task, updated);
    updated._id = id;
    return new TaskDto(updated);
  }

  @Post(':id/done')
  async setDone(
    @Request() req,
    @Param('id') id,
    @Body() dto: UpdateTaskStateDto,
  ): Promise<DoneTaskResultDto> {
    const task = await this.findTaskById(req.user, id);
    const profile = await this.findProfileByUserAndId(req.user, <any>task.profile);
    await this.tasksService.setDone(profile, task, dto.date);
    return new DoneTaskResultDto({
      score: profile.score,
      done: task.done.toString(),
    });
  }

  @Post(':id/undone')
  async setUndone(
    @Request() req,
    @Param('id') id,
    @Body() dto: UpdateTaskStateDto,
  ): Promise<DoneTaskResultDto> {
    const task = await this.findTaskById(req.user, id);
    const profile = await this.findProfileByUserAndId(req.user, <any>task.profile);
    await this.tasksService.setUnDone(profile, task, dto.date);
    return new DoneTaskResultDto({ score: profile.score, done: undefined });
  }

  private async findTaskById(user: User, id: string): Promise<TaskDocument> {
    const habit = await this.tasksService.findByOwnerAndId(user, id);

    if (!habit) {
      throw new NotFoundException();
    }

    return habit;
  }

   */
}
