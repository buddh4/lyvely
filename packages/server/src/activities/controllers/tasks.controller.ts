import {
  Post,
  Body,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
} from '@nestjs/common';
import { Task } from '../schemas';
import {
  UpdateTaskStateModel,
  UpdateTaskStateResponse,
  UpdateTaskModel,
  UpdateTaskResponse,
  TasksEndpoint,
  CreateTaskModel,
  TimerValueUpdateModel,
  TimerModel,
} from '@lyvely/common';
import { TasksService } from '../services/tasks.service';
import {
  AbstractContentTypeController,
  ContentTypeController,
  ContentWritePolicy,
  ProfileContentRequest,
} from '@/content';
import { Policies } from '@/policies';

@ContentTypeController('tasks', Task)
// TODO: implement feature registration @Feature('content.activities.tasks')
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController
  extends AbstractContentTypeController<Task, CreateTaskModel, UpdateTaskModel>
  implements TasksEndpoint
{
  @Inject()
  protected readonly contentService: TasksService;

  protected updateResponseType = UpdateTaskResponse;

  @Post(':cid/done')
  @Policies(ContentWritePolicy)
  async setDone(@Body() dto: UpdateTaskStateModel, @Request() req: ProfileContentRequest<Task>) {
    const { profile, user, content } = req;

    await this.contentService.setDone(profile, user, content, dto.date);
    return new UpdateTaskStateResponse({
      score: profile.score,
      done: content.getDoneBy(user)?.tid,
    });
  }

  @Post(':cid/undone')
  @Policies(ContentWritePolicy)
  async setUndone(@Body() dto: UpdateTaskStateModel, @Request() req: ProfileContentRequest<Task>) {
    const { profile, user, content } = req;

    await this.contentService.setUndone(profile, user, content, dto.date);
    return new UpdateTaskStateResponse({ score: profile.score, done: undefined });
  }

  @Post(':cid/start-timer')
  @Policies(ContentWritePolicy)
  async startTimer(@Request() req: ProfileContentRequest<Task>) {
    const { profile, user, content } = req;

    const timer = await this.contentService.startTimer(profile, user, content);
    return new TimerModel(timer);
  }

  @Post(':cid/stop-timer')
  @Policies(ContentWritePolicy)
  async stopTimer(@Request() req: ProfileContentRequest<Task>) {
    const { profile, user, content } = req;

    const timer = await this.contentService.stopTimer(profile, user, content);
    return new TimerModel(timer);
  }

  @Post(':cid/update-timer')
  @Policies(ContentWritePolicy)
  async updateTimer(
    @Body() dto: TimerValueUpdateModel,
    @Request() req: ProfileContentRequest<Task>,
  ) {
    const { profile, user, content } = req;

    const timer = await this.contentService.updateTimerValue(profile, user, content, dto.value);
    return new TimerModel(timer);
  }
}
