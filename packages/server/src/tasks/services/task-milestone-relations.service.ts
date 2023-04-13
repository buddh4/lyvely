import { Injectable, Inject } from '@nestjs/common';
import { Task } from '../schemas';
import { CreateTaskModel } from '@lyvely/common';
import { TasksDao } from '../daos';
import { ContentTypeService, ContentScoreService } from '@/content';
import { OnEvent } from '@nestjs/event-emitter';
import { MilestoneRelationEvent } from '@/milestones';

@Injectable()
export class TasksService extends ContentTypeService<Task, CreateTaskModel> {
  @Inject()
  protected contentDao: TasksDao;

  @Inject()
  private scoreService: ContentScoreService;

  @OnEvent(MilestoneRelationEvent.getKeyByContentType(Task.name))
  handleOrderCreatedEvent(payload: MilestoneRelationEvent) {}
}
