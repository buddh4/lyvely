import { Injectable } from '@nestjs/common';
import { Habit, Task } from './schemas';
import { IContentTypeDefinition } from '../content';
import { IFeature, ModuleEvents } from '@/core';

@Injectable()
export class ActivityEvents extends ModuleEvents {
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
}
