import { IFeature } from '@lyvely/interface';
import { TASKS_MODULE_ID } from './tasks.constants';

export const TasksFeature: IFeature = {
  id: 'tasks',
  title: 'tasks.feature.title',
  description: 'tasks.feature.description',
  moduleId: TASKS_MODULE_ID,
  installable: true,
  configurable: false,
  enabledByDefault: true,
};

export const ActivityTasksFeature: IFeature = {
  id: 'tasks-activities',
  title: 'tasks.feature.activities.title',
  description: 'tasks.feature.activities.description',
  moduleId: TASKS_MODULE_ID,
  installable: true,
  enabledByDefault: true,
  dependencies: [TasksFeature.id, 'activities'],
};
