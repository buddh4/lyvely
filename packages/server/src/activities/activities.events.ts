import { Injectable } from '@nestjs/common';
import { Habit, Task } from './schemas';
import { ContentTypeDefinition } from '../content/interfaces/content-type.interface';
import { Feature } from '../core/features/feature.interface';
import { ContentModuleEvents } from '../content/interfaces/content-module.events';

@Injectable()
export class ActivityEvents extends ContentModuleEvents {

  getFeatures(): Feature[] {
    return [
      {
        id: 'content.activities',
        moduleId: 'activities',
        name: 'Activities',
        description: 'Management habits and/or tasks',
        enabled: true
      },
      {
        id: 'content.activities.habits',
        moduleId: 'activities',
        name: 'Habits',
        description: 'Management of repeating habits/activities',
        enabled: true
      },
      {
        id: 'content.activities.tasks',
        moduleId: 'activities',
        name: 'Tasks',
        description: 'Management of tasks',
        enabled: true
      }
    ];
  }

  getContentTypes(): ContentTypeDefinition[] {
    return [
      {
        type: Habit.name,
        moduleId: 'activities',
        constructor: Habit,
        name: 'Habit',
        description: 'A Habit/Activity'
      },
      {
        type: Task.name,
        moduleId: 'activities',
        constructor: Task,
        name: 'Task',
        description: 'A Task'
      }
    ];
  }
}