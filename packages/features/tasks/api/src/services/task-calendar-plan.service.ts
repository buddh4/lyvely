import { Injectable, Inject } from '@nestjs/common';
import { Task } from '../schemas';
import { SortableCalendarPlanService } from '@lyvely/calendar-plan';
import { TasksDao } from '../daos';

@Injectable()
export class TaskCalendarPlanService extends SortableCalendarPlanService<Task> {
  @Inject()
  protected contentDao: TasksDao;
}
