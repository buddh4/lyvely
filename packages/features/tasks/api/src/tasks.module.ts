import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UsersModule,
  ContentModule,
  getContentModelDefinition,
  getContentScoreDefinition,
  ProfilesModule,
  PoliciesModule,
  CoreModule,
  LyvelyModule,
} from '@lyvely/api';
import { Task, TaskSchema, TaskScore, TaskScoreSchema } from './schemas';
import { TasksController } from './controllers';
import { TasksDao } from './daos';
import { TaskCalendarPlanService, TaskMilestoneRelationsService, TasksService } from './services';
import { TASKS_MODULE_ID, TasksFeature, ActivityTasksFeature } from '@lyvely/tasks-interface';

@LyvelyModule({
  id: TASKS_MODULE_ID,
  name: 'Tasks',
  path: __dirname,
  features: [TasksFeature, ActivityTasksFeature],
  imports: [
    CoreModule,
    UsersModule,
    PoliciesModule,
    ProfilesModule,
    ContentModule.registerContentType(Task),
    MongooseModule.forFeature([
      getContentModelDefinition([{ name: Task.name, schema: TaskSchema }]),
      getContentScoreDefinition([{ name: TaskScore.name, schema: TaskScoreSchema }]),
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksDao, TasksService, TaskCalendarPlanService, TaskMilestoneRelationsService],
})
export class TasksModule {}
