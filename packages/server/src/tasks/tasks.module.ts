import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@/users';
import { ContentModule, getContentModelDefinition, getContentScoreDefinition } from '@/content';
import { ProfilesModule } from '@/profiles';
import { PoliciesModule } from '@/policies/policies.module';
import { CoreModule } from '@/core';
import { Task, TaskSchema, TaskScore, TaskScoreSchema } from './schemas';
import { TasksController } from '@/tasks/controllers';
import { TasksDao } from '@/tasks/daos';
import { TasksService } from '@/tasks/services';
import { TaskTimeSeriesService } from '@/tasks/services/task-time-series.service';

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
  providers: [TasksDao, TasksService, TaskTimeSeriesService],
})
export class TasksModule {}