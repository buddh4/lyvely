import { TimeSeriesContent, useDataPointConfigHandler } from '../schemas';
import type { ICalendarPlanSearchFilter } from '@lyvely/calendar-plan';
import { CalendarPlanDao } from '@lyvely/calendar-plan';
import { CalendarInterval } from '@lyvely/dates';
import { ProtectedProfileContentContext } from '@lyvely/api';
import type { UpdateQuerySet } from '@lyvely/api';

export abstract class TimeSeriesContentDao<
  TModel extends TimeSeriesContent,
  TFilter extends ICalendarPlanSearchFilter = ICalendarPlanSearchFilter,
  TVersions extends TModel = TModel,
> extends CalendarPlanDao<TModel, TFilter, TVersions> {
  override intervalPath = 'config.timeSeries.interval';

  /**
   * Updates the time-series content interval and creates a new config history.
   * @param context
   * @param interval
   */
  override async updateInterval(
    context: ProtectedProfileContentContext<TModel>,
    interval: CalendarInterval
  ): Promise<boolean> {
    const { profile, content } = context;
    const update: UpdateQuerySet<TModel> = { [this.intervalPath]: interval };
    useDataPointConfigHandler().applyUpdate(content, { interval });
    update['config.timeSeries.history'] = content.timeSeriesConfig.history;
    return this.updateOneByProfileAndIdSet(profile, content, update);
  }
}
