import { TimeSeriesRangeFilter, getTimingIdsByRange } from './time-series-range-filter.model';
import { CalendarDate, subtractDays } from '../../calendar';

export class LoadedTimingIdStore {
  private loadedTimingIds: Set<string> = new Set<string>();

  addLoadedTimingIds(ids: string[]) {
    if(!ids || !ids.length) {
      return;
    }

    for(const timingId of ids) {
      this.loadedTimingIds.add(timingId);
    }
  }

  filterOutLoadedTimingIds(requiredTimingIds: string[]) {
    return requiredTimingIds.filter(requiredId => !this.loadedTimingIds.has(requiredId));
  }

  getCalendarFilter(date: CalendarDate, range = 3): TimeSeriesRangeFilter | false {
    const from = subtractDays(date, range);

    const filter = TimeSeriesRangeFilter.createForRange(from, date);
    const requiredTimingIds = getTimingIdsByRange(filter);
    const filteredTimingIds = this.filterOutLoadedTimingIds(requiredTimingIds);

    if(!filteredTimingIds.length) {
      return false;
    }

    if(requiredTimingIds.length !== filteredTimingIds.length) {
      filter.includes = filteredTimingIds;
    }

    return filter;
  }
}
