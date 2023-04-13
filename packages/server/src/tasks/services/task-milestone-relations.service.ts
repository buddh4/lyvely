import { Injectable } from '@nestjs/common';
import { Task } from '../schemas';
import { OnEvent } from '@nestjs/event-emitter';
import { MilestoneRelationEvent } from '@/milestones';
import { MilestoneRelationModel } from '@lyvely/common';

@Injectable()
export class TaskMilestoneRelationsService {
  @OnEvent(MilestoneRelationEvent.getKeyByContentType(Task.name))
  handleOrderCreatedEvent(payload: MilestoneRelationEvent<Task>) {
    payload.setResult(
      payload.data.contents.map((content) => {
        const progress = content.getDoneBy(payload.data.user) ? 1 : 0;
        return new MilestoneRelationModel(content, progress);
      }),
    );
  }
}
