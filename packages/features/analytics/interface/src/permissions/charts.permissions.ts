import { createContentPermissions } from '@lyvely/interface';
import { ChartModel } from '../models';
import { ANALYTICS_MODULE_ID } from '../analytics.constants';
import { AnalyticsFeature } from '../analytics.features';

const Permissions = createContentPermissions(
  ChartModel.contentType,
  ANALYTICS_MODULE_ID,
  AnalyticsFeature.id
);

export const useChartsPermissions = () => Permissions;

export const ChartsPermissions = [
  Permissions.Create,
  Permissions.Manage,
  Permissions.Write,
  Permissions.Delete,
];
