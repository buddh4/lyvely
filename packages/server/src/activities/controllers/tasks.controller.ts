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
  TasksEndpoint,
  CreateTaskDto,
  TimerUpdate,
  TimerValueUpdate,
  TimerModel,
} from '@lyvely/common';
import { TasksService } from '../services/tasks.service';
import { ContentController, ContentWritePolicy, ProfileContentRequest } from '@/content';
import { ProfileRequest } from '@/profiles';
import { Policies } from '@/policies';

@ContentController('tasks', Task)
// TODO: implement feature registration @Feature('content.activities.tasks')
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
  @Policies(ContentWritePolicy)
  async update(@Body() update: UpdateTaskDto, @Request() req: ProfileContentRequest<Task>) {
    const { profile, user, content } = req;

    content.applyUpdate(update);
    await this.tasksService.updateContent(profile, user, content, content, update.tagNames);

    return new UpdateTaskResponseDto({
      model: new TaskModel(content),
      tags: profile.getNewTags().map((tag) => new TagModel(tag)),
    });
  }

  @Post(':cid/done')
  @Policies(ContentWritePolicy)
  async setDone(@Body() dto: UpdateTaskStateModel, @Request() req: ProfileContentRequest<Task>) {
    const { profile, user, content } = req;

    await this.tasksService.setDone(profile, user, content, dto.date);
    return new UpdateTaskStateResultDto({
      score: profile.score,
      done: content.getDoneBy(user)?.tid,
    });
  }

  @Post(':cid/undone')
  @Policies(ContentWritePolicy)
  async setUndone(@Body() dto: UpdateTaskStateModel, @Request() req: ProfileContentRequest<Task>) {
    const { profile, user, content } = req;

    await this.tasksService.setUndone(profile, user, content, dto.date);
    return new UpdateTaskStateResultDto({ score: profile.score, done: undefined });
  }

  @Post(':cid/start-timer')
  @Policies(ContentWritePolicy)
  async startTimer(@Request() req: ProfileContentRequest<Task>) {
    const { profile, user, content } = req;

    const timer = await this.tasksService.startTimer(profile, user, content);
    return new TimerModel(timer);
  }

  @Post(':cid/stop-timer')
  @Policies(ContentWritePolicy)
  async stopTimer(@Request() req: ProfileContentRequest<Task>) {
    const { profile, user, content } = req;

    const timer = await this.tasksService.stopTimer(profile, user, content);
    return new TimerModel(timer);
  }

  @Post(':cid/update-timer')
  @Policies(ContentWritePolicy)
  async updateTimer(@Body() dto: TimerValueUpdate, @Request() req: ProfileContentRequest<Task>) {
    const { profile, user, content } = req;

    const timer = await this.tasksService.updateTimerValue(profile, user, content, dto.value);
    return new TimerModel(timer);
  }
}
