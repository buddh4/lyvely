import { createContentPermissions } from '@lyvely/interface';
import { TaskModel } from '../models';
import { TASKS_MODULE_ID } from '../tasks.constants';
import { TasksFeature } from '../tasks.features';

const Permissions = createContentPermissions(
  TaskModel.contentType,
  TASKS_MODULE_ID,
  TasksFeature.id
);

export const useTaskPermissions = () => Permissions;

export const TaskPermissions = [
  Permissions.Create,
  Permissions.Manage,
  Permissions.Write,
  Permissions.Delete,
];
