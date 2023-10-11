import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@lyvely/core';
import { ContentModule, getContentModelDefinition, getContentScoreDefinition } from '@lyvely/core';
import { ProfilesModule } from '@lyvely/core';
import { PoliciesModule } from '@lyvely/core';
import { CoreModule } from '@lyvely/core';
import { Task, TaskSchema, TaskScore, TaskScoreSchema } from './schemas';
import { TasksController } from './controllers';
import { TasksDao } from './daos';
import { TaskCalendarPlanService, TaskMilestoneRelationsService, TasksService } from './services';

@Module({
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
