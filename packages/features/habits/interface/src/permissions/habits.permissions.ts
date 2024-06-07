import { createContentPermissions } from '@lyvely/interface';
import { HabitModel } from '../models';
import { HABITS_MODULE_ID } from '../habits.constants';
import { HabitsFeature } from '../habits.features';

const Permissions = createContentPermissions(
  HabitModel.contentType,
  HABITS_MODULE_ID,
  HabitsFeature.id
);

export const useHabitPermissions = () => Permissions;

export const HabitsPermissions = [
  Permissions.Create,
  Permissions.Manage,
  Permissions.Write,
  Permissions.Delete,
];
