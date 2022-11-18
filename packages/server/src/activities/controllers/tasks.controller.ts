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
  UpdateTaskResponseDto,
  TaskModel,
  TagModel,
  EntityNotFoundException,
  TasksEndpoint,
  CreateTaskDto,
} from '@lyvely/common';
import { TasksService } from '../services/tasks.service';
import { ContentController, ContentType, ProfileContentRequest } from '@/content';
import { ProfileRequest } from '@/profiles';
import { isTaskContent } from '../utils/activity.utils';

@ContentController('tasks')
// TODO: implement feature registration @Feature('content.activities.tasks')
@ContentType(Task)
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController implements TasksEndpoint {
  @Inject()
  private readonly tasksService: TasksService;

  @Post()
  async create(@Body() dto: CreateTaskDto, @Request() req: ProfileRequest) {
    const { profile, user } = req;

    const activity = await this.tasksService.createContent(
      profile,
      user,
      Task.create(profile, user, dto),
      dto.tagNames,
    );

    if (!activity) {
      throw new InternalServerErrorException();
    }

    return new UpdateTaskResponseDto({
      model: new TaskModel(activity),
      tags: profile.getNewTags().map((tag) => new TagModel(tag)),
    });
  }

  @Put(':cid')
  async update(@Body() update: UpdateTaskDto, @Request() req: ProfileContentRequest) {
    const { profile, user, content } = req;

    if (!isTaskContent(content)) {
      throw new EntityNotFoundException();
    }

    Task.applyUpdate(content, new UpdateTaskDto(update));
    await this.tasksService.updateContent(profile, user, content, content, update.tagNames);

    return new UpdateTaskResponseDto({
      model: new TaskModel(content),
      tags: profile.getNewTags().map((tag) => new TagModel(tag)),
    });
  }

  @Post(':cid/done')
  async setDone(@Body() dto: UpdateTaskStateModel, @Request() req: ProfileContentRequest<Task>) {
    const { profile, user, content } = req;

    if (!isTaskContent(content)) {
      throw new EntityNotFoundException();
    }

    await this.tasksService.setDone(profile, user, content, dto.date);
    return new UpdateTaskStateResultDto({ score: profile.score, done: content.getDoneBy(user)?.tid });
  }

  @Post(':cid/undone')
  async setUndone(@Body() dto: UpdateTaskStateModel, @Request() req: ProfileContentRequest<Task>) {
    const { profile, user, content } = req;

    if (!isTaskContent(content)) {
      throw new EntityNotFoundException();
    }

    await this.tasksService.setUndone(profile, user, content, dto.date);
    return new UpdateTaskStateResultDto({ score: profile.score, done: undefined });
  }
}
