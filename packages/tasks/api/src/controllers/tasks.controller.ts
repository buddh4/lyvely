import {
  Post,
  Body,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Task } from '../schemas';
import {
  UpdateTaskStateModel,
  UpdateTaskStateResponse,
  UpdateTaskModel,
  UpdateTaskResponse,
  TasksEndpoint,
  TaskSearchResponse,
  CreateTaskModel,
} from '@lyvely/tasks-interface';
import { TimerModel, TimerValueUpdateModel } from '@lyvely/timers';
import { CalendarPlanFilter, CalendarPlanSort } from '@lyvely/calendar-plan';
import { SortResponse } from '@lyvely/common';
import { TasksService, TaskCalendarPlanService } from '../services';
import {
  AbstractContentTypeController,
  ContentTypeController,
  ContentWritePolicy,
  ProfileContentRequest,
} from '@lyvely/content';
import { Policies } from '@lyvely/policies';
import { ProfileRequest } from '@lyvely/profiles';

@ContentTypeController('tasks', Task)
// TODO: implement feature registration @Feature('tasks')
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController
  extends AbstractContentTypeController<Task, CreateTaskModel, UpdateTaskModel>
  implements TasksEndpoint
{
  @Inject()
  protected readonly contentService: TasksService;

  @Inject()
  protected calendarPlanService: TaskCalendarPlanService;

  protected updateResponseType = UpdateTaskResponse;
  protected createModelType = CreateTaskModel;
  protected updateModelType = UpdateTaskModel;

  @Get()
  async getByFilter(
    @Query(new ValidationPipe({ transform: true })) filter: CalendarPlanFilter,
    @Request() req: ProfileRequest,
  ): Promise<TaskSearchResponse> {
    const { profile, user } = req;
    const models = await this.calendarPlanService.findByFilter(profile, user, filter);
    return new TaskSearchResponse({
      models: models.map((c) => c.toModel(user)),
    });
  }

  @Post(':cid/sort')
  @Policies(ContentWritePolicy)
  async sort(@Body() dto: CalendarPlanSort, @Request() req: ProfileContentRequest<Task>) {
    const { profile, user, content } = req;
    const sort = await this.calendarPlanService.sort(
      profile,
      user,
      content,
      dto.interval,
      dto.attachToId,
    );
    return new SortResponse({ sort });
  }

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
  async startTimer(@Request() req: ProfileContentRequest<Task>): Promise<TimerModel> {
    const { profile, user, content } = req;

    const timer = await this.contentService.startTimer(profile, user, content);
    return new TimerModel<any>(timer);
  }

  @Post(':cid/stop-timer')
  @Policies(ContentWritePolicy)
  async stopTimer(@Request() req: ProfileContentRequest<Task>): Promise<TimerModel> {
    const { profile, user, content } = req;

    const timer = await this.contentService.stopTimer(profile, user, content);
    return new TimerModel<any>(timer);
  }

  @Post(':cid/update-timer')
  @Policies(ContentWritePolicy)
  async updateTimer(
    @Body() dto: TimerValueUpdateModel,
    @Request() req: ProfileContentRequest<Task>,
  ) {
    const { profile, user, content } = req;

    const timer = await this.contentService.updateTimerValue(profile, user, content, dto.value);
    return new TimerModel<any>(timer);
  }
}
