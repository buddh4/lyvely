import { CalendarDate } from '../interfaces';
export declare class DayIterator implements Iterable<Date> {
    private readonly currentDate;
    private readonly toDate;
    constructor(from: CalendarDate, to: CalendarDate);
    [Symbol.iterator](): {
        next(): IteratorResult<Date>;
    };
}
