import { toTimingId } from '@lyvely/dates';
import { CalendarPlanFilter } from '@lyvely/calendar-plan-interface';
export class LoadedTimingIdStore {
    constructor() {
        this.loadedTimingIds = new Set();
    }
    reset() {
        this.loadedTimingIds = new Set();
    }
    addLoadedTimingIds(ids) {
        if (!ids || !ids.length) {
            return;
        }
        for (const timingId of ids) {
            this.loadedTimingIds.add(timingId);
        }
    }
    filterOutLoadedTimingIds(requiredTimingIds) {
        return requiredTimingIds.filter((requiredId) => !this.loadedTimingIds.has(requiredId));
    }
    getCalendarPlanFilter(date) {
        const tid = toTimingId(date);
        if (this.loadedTimingIds.has(tid)) {
            return false;
        }
        return new CalendarPlanFilter(date);
    }
}
