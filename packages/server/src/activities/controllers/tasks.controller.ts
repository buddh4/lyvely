import {
  Post,
  Param,
  Body,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Task } from '../schemas';
import {
  UpdateTaskStateModel,
  DoneTaskResultModel,
  EditTaskDto,
  TaskDto,
  ITask
} from '@lyvely/common';
import { TasksService } from '../services/tasks.service';
import { ContentController, ContentType, ProfileContentRequest } from '../../content';
import { ProfileRequest } from "../../core/types";
import { isTaskContent } from "../utils/activity.utils";
import { EntityNotFoundException } from "../../core/exceptions";

@ContentController('tasks')
// TODO: implement feature registration @Feature('content.activities.tasks')
@ContentType(Task)
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController {
  @Inject()
  private readonly tasksService: TasksService;

  @Post()
  async create(@Request() req: ProfileRequest, @Body() dto: EditTaskDto): Promise<TaskDto> {
    const { profile, user } = req;

    const activity = await this.tasksService.createContent(profile, user, Task.create(profile, user, dto));

    if (!activity) {
      throw new InternalServerErrorException();
    }

    return new TaskDto(activity);
  }

  @Post(':cid')
  async update(
    @Request() req: ProfileContentRequest,
    @Param('cid') id,
    @Body() dto: EditTaskDto,
  ): Promise<{ success: boolean } | TaskDto> {
    const { profile, user, content } = req;

    if(!isTaskContent(content)) {
      throw new EntityNotFoundException();
    }

    await this.tasksService.updateContent(profile, user, content as Task, Task.create(profile, user, dto));
    return new TaskDto(content);
  }

  @Post(':cid/done')
  async setDone(
    @Request() req: ProfileContentRequest<Task>,
    @Body() dto: UpdateTaskStateModel,
  ): Promise<DoneTaskResultModel> {
    const { profile, user, content } = req;

    if(!isTaskContent(content)) {
      throw new EntityNotFoundException();
    }

    await this.tasksService.setDone(profile, user, content, dto.date);
    return new DoneTaskResultModel({
      score: profile.score,
      done: content.getDoneBy(user)?.tid
    });
  }

    @Post(':cid/undone')
    async setUndone(
      @Request() req: ProfileContentRequest<Task>,
      @Body() dto: UpdateTaskStateModel,
    ): Promise<DoneTaskResultModel> {
      const { profile, user, content } = req;

      if(!isTaskContent(content)) {
        throw new EntityNotFoundException();
      }

      await this.tasksService.setUndone(profile, user, content, dto.date);
      return new DoneTaskResultModel({ score: profile.score, done: undefined });
    }
}
