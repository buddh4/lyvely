import { createContentPermissions } from '@lyvely/interface';
import { MilestoneModel } from '../models';
import { MILESTONES_MODULE_ID } from '../milestones.constants';
import { MilestonesFeature } from '../milestones.features';

const Permissions = createContentPermissions(
  MilestoneModel.contentType,
  MILESTONES_MODULE_ID,
  MilestonesFeature.id
);

export const useMilestonePermissions = () => Permissions;

export const MilestonesPermissions = [
  Permissions.Create,
  Permissions.Manage,
  Permissions.Write,
  Permissions.Delete,
];
