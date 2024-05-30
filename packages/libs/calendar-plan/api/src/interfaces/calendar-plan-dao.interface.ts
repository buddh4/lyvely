import {
  IFetchQueryOptions,
  ContentTypeDao,
  ProfileContext,
  ProtectedProfileContentContext,
} from '@lyvely/api';
import { CalendarInterval } from '@lyvely/dates';
import { CalendarPlanEntity } from './calendar-plan-entitiy.interface';
import type { IContentSearchFilter } from '@lyvely/api';

export interface ICalendarPlanSearchFilter extends IContentSearchFilter {
  interval?: CalendarInterval;
  tIds?: string[];
}

export interface ICalendarPlanIntervalSearchFilter extends IContentSearchFilter {
  interval: CalendarInterval;
}

export interface ICalendarPlanTidSearchFilter extends ICalendarPlanSearchFilter {
  tIds: string[];
}

export interface ICalendarPlanDao<
  TModel extends CalendarPlanEntity,
  TFilter extends ICalendarPlanSearchFilter = ICalendarPlanSearchFilter,
  TVersions extends TModel = TModel,
> extends ContentTypeDao<TModel, TFilter, TVersions> {
  updateInterval(
    context: ProtectedProfileContentContext,
    interval: CalendarInterval
  ): Promise<boolean>;
  findByTimingIds(
    context: ProfileContext,
    filter: TFilter & ICalendarPlanTidSearchFilter,
    options?: IFetchQueryOptions<TModel>
  ): Promise<TModel[]>;
  findByInterval(
    context: ProfileContext,
    filter?: TFilter & ICalendarPlanIntervalSearchFilter,
    options?: IFetchQueryOptions<TModel>
  ): Promise<TModel[]>;
}
