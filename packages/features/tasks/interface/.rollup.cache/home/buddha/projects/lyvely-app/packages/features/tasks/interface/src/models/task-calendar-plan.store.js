import { sortTasks } from './task.sort';
import { CalendarPlanStore } from '@lyvely/calendar-plan-interface';
export class TaskCalendarPlanStore extends CalendarPlanStore {
    sort(models) {
        return sortTasks(models);
    }
    getModelsByIntervalFilter(interval, filter, tid) {
        return this.filterModels((entry) => {
            return (entry.interval === interval &&
                (!entry.done || entry.done === tid) &&
                (!filter || filter.check(entry)));
        });
    }
}
