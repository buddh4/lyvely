import { createContentPermissions } from '@lyvely/interface';
import { JournalModel } from '../models';
import { JOURNALS_MODULE_ID } from '../journals.constants';
import { JournalsFeature } from '../journals.features';

const Permissions = createContentPermissions(
  JournalModel.contentType,
  JOURNALS_MODULE_ID,
  JournalsFeature.id
);

export const useJournalPermissions = () => Permissions;

export const JournalPermissions = [
  Permissions.Create,
  Permissions.Manage,
  Permissions.Write,
  Permissions.Delete,
];
