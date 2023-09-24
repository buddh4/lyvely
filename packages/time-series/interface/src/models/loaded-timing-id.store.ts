import { CalendarDate } from '@lyvely/dates';
import { CalendarPlanFilter, toTimingId } from '@lyvely/dates';

export class LoadedTimingIdStore {
  private loadedTimingIds: Set<string> = new Set<string>();

  reset() {
    this.loadedTimingIds = new Set();
  }

  addLoadedTimingIds(ids: string[]) {
    if (!ids || !ids.length) {
      return;
    }

    for (const timingId of ids) {
      this.loadedTimingIds.add(timingId);
    }
  }

  filterOutLoadedTimingIds(requiredTimingIds: string[]) {
    return requiredTimingIds.filter((requiredId) => !this.loadedTimingIds.has(requiredId));
  }

  getCalendarPlanFilter(date: CalendarDate): CalendarPlanFilter | false {
    const tid = toTimingId(date);

    if (this.loadedTimingIds.has(tid)) {
      return false;
    }

    // Note: In an earlier implementation TimeSeriesRangeFilter was used instead of CalendarPlanFilter
    //const tids = getTimingIdsByRange(new TimeSeriesRangeFilter({ from: date, to: date }));

    // TODO: Filter out already loaded levels
    // If we've already loaded today, we do not need to lead this year again so level is daily (unless week changed)

    return new CalendarPlanFilter(date);
  }
}
