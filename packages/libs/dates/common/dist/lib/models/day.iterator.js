import { getFullDayDate } from '../interfaces';
import { addDays } from '../utils/date-calculation.util';
export class DayIterator {
    constructor(from, to) {
        this.currentDate = getFullDayDate(from);
        this.toDate = getFullDayDate(to);
    }
    [Symbol.iterator]() {
        let currentDate = this.currentDate;
        const toDate = this.toDate;
        return {
            next() {
                if (currentDate <= toDate) {
                    const result = { value: currentDate, done: false };
                    currentDate = addDays(currentDate, 1);
                    return result;
                }
                return { value: null, done: true };
            },
        };
    }
}
//# sourceMappingURL=day.iterator.js.map