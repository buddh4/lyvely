import { TASKS_MODULE_ID } from './tasks.constants';
import { createContentFeature, createProfileFeature } from '@lyvely/interface';

export const TasksFeature = createContentFeature('tasks', TASKS_MODULE_ID);
export const ActivityTasksFeature = createProfileFeature('tasks-activities', TASKS_MODULE_ID, {
  dependencies: [TasksFeature.id, 'activities'],
});
