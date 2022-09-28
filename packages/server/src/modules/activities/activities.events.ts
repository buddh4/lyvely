import { Injectable } from '@nestjs/common';
import { Habit, Task } from './schemas';
import { ContentTypeDefinition, ContentModuleEvents, Content } from '../content';
import { IFeature } from '@/modules/core';

@Injectable()
export class ActivityEvents extends ContentModuleEvents {
  getFeatures(): IFeature[] {
    return [
      {
        id: 'content.activities',
        moduleId: 'activities',
        name: 'Activities',
        description: 'Management habits and/or tasks',
        enabled: true,
      },
      {
        id: 'content.activities.habits',
        moduleId: 'activities',
        name: 'Habits',
        description: 'Management of repeating habits/activities',
        enabled: true,
      },
      {
        id: 'content.activities.tasks',
        moduleId: 'activities',
        name: 'Tasks',
        description: 'Management of tasks',
        enabled: true,
      },
    ];
  }

  getContentTypes(): ContentTypeDefinition<Content>[] {
    return [
      {
        type: Habit.name,
        moduleId: 'activities',
        constructor: Habit,
        name: 'Habit',
        description: 'A Habit/Activity',
      },
      {
        type: Task.name,
        moduleId: 'activities',
        constructor: Task,
        name: 'Task',
        description: 'A Task',
      },
    ];
  }
}
