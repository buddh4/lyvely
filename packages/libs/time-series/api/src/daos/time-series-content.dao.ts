import { TimeSeriesContent } from '../schemas';
import type { ICalendarPlanSearchFilter } from '@lyvely/calendar-plan';
import { CalendarPlanDao } from '@lyvely/calendar-plan';

export abstract class TimeSeriesContentDao<
  TModel extends TimeSeriesContent,
  TFilter extends ICalendarPlanSearchFilter = ICalendarPlanSearchFilter,
  TVersions extends TModel = TModel,
> extends CalendarPlanDao<TModel, TFilter, TVersions> {
  override intervalPath = 'config.timeSeries.interval';
}
