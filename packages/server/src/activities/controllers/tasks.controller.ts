import {
  Post,
  Put,
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
  UpdateTaskStateResultDto,
  UpdateTaskDto,
  TaskDto,
 EditTaskResponseDto, TagDto } from '@lyvely/common';
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
  async create(@Request() req: ProfileRequest, @Body() dto: UpdateTaskDto) {
    const { profile, user } = req;

    const activity = await this.tasksService.createContent(profile, user, Task.create(profile, user, dto), dto.tagNames);

    if (!activity) {
      throw new InternalServerErrorException();
    }

    return new EditTaskResponseDto({
      model: new TaskDto(activity),
      tags: profile.getNewTags().map(tag => new TagDto(tag))
    });
  }

  @Put(':cid')
  async update(@Request() req: ProfileContentRequest, @Body() update: UpdateTaskDto) {
    const { profile, user, content } = req;

    if(!isTaskContent(content)) {
      throw new EntityNotFoundException();
    }

    Task.applyUpdate(content, update);
    await this.tasksService.updateContent(profile, user, content, content, update.tagNames);

    return new EditTaskResponseDto({
      model: new TaskDto(content),
      tags: profile.getNewTags().map(tag => new TagDto(tag))
    });
  }

  @Post(':cid/done')
  async setDone(@Request() req: ProfileContentRequest<Task>, @Body() dto: UpdateTaskStateModel,) {
    const { profile, user, content } = req;

    if(!isTaskContent(content)) {
      throw new EntityNotFoundException();
    }

    await this.tasksService.setDone(profile, user, content, dto.date);
    return new UpdateTaskStateResultDto({ score: profile.score, done: content.getDoneBy(user)?.tid });
  }

    @Post(':cid/undone')
    async setUndone(@Request() req: ProfileContentRequest<Task>, @Body() dto: UpdateTaskStateModel) {
      const { profile, user, content } = req;

      if(!isTaskContent(content)) {
        throw new EntityNotFoundException();
      }

      await this.tasksService.setUndone(profile, user, content, dto.date);
      return new UpdateTaskStateResultDto({ score: profile.score, done: undefined });
    }
}
