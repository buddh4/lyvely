import {
  Post,
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
  ENDPOINT_TASKS,
  TasksEndpoints,
} from '@lyvely/tasks-interface';
import {
  TimerModel,
  TimerValueUpdateModel,
  SortResponse,
  AbstractContentTypeController,
  ContentTypeController,
  ContentWritePolicy,
  ProtectedProfileContentRequest,
  Policies,
  ProfileRequest,
  ValidBody,
} from '@lyvely/api';
import { CalendarPlanFilter, CalendarPlanSort } from '@lyvely/calendar-plan';
import { TasksService, TaskCalendarPlanService } from '../services';

@ContentTypeController(ENDPOINT_TASKS, Task)
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
    @Request() req: ProfileRequest
  ): Promise<TaskSearchResponse> {
    const { context, user } = req;
    const models = await this.calendarPlanService.findByFilter(context, filter);
    return new TaskSearchResponse({
      models: models.map((c) => c.toModel(user)),
    });
  }

  @Post(TasksEndpoints.SORT(':cid'))
  @Policies(ContentWritePolicy)
  async sort(
    @ValidBody() dto: CalendarPlanSort,
    @Request() req: ProtectedProfileContentRequest<Task>
  ) {
    const { context } = req;
    const sort = await this.calendarPlanService.sort(context, dto.interval, dto.attachToId);
    return new SortResponse({ sort });
  }

  @Post(TasksEndpoints.SET_DONE(':cid'))
  @Policies(ContentWritePolicy)
  async setDone(
    @ValidBody() dto: UpdateTaskStateModel,
    @Request() req: ProtectedProfileContentRequest<Task>
  ) {
    const { context, profile, user, content } = req;

    await this.contentService.setDone(context, content, dto.date);
    return new UpdateTaskStateResponse({
      score: profile.score,
      done: content.getDoneBy(user)?.tid,
    });
  }

  @Post(TasksEndpoints.SET_UNDONE(':cid'))
  @Policies(ContentWritePolicy)
  async setUndone(
    @ValidBody() dto: UpdateTaskStateModel,
    @Request() req: ProtectedProfileContentRequest<Task>
  ) {
    const { context, profile, content } = req;

    await this.contentService.setUndone(context, content, dto.date);
    return new UpdateTaskStateResponse({ score: profile.score, done: undefined });
  }

  @Post(TasksEndpoints.START_TIMER(':cid'))
  @Policies(ContentWritePolicy)
  async startTimer(@Request() req: ProtectedProfileContentRequest<Task>): Promise<TimerModel> {
    const { context, content } = req;

    const timer = await this.contentService.startTimer(context, content);
    return new TimerModel<any>(timer);
  }

  @Post(TasksEndpoints.STOP_TIMER(':cid'))
  @Policies(ContentWritePolicy)
  async stopTimer(@Request() req: ProtectedProfileContentRequest<Task>): Promise<TimerModel> {
    const { context, content } = req;

    const timer = await this.contentService.stopTimer(context, content);
    return new TimerModel<any>(timer);
  }

  @Post(TasksEndpoints.UPDATE_TIMER(':cid'))
  @Policies(ContentWritePolicy)
  async updateTimer(
    @ValidBody() dto: TimerValueUpdateModel,
    @Request() req: ProtectedProfileContentRequest<Task>
  ) {
    const { context, content } = req;

    const timer = await this.contentService.updateTimerValue(context, content, dto.value);
    return new TimerModel<any>(timer);
  }
}
