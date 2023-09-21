"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayIterator = void 0;
const interfaces_1 = require("../interfaces");
const date_calculation_util_1 = require("../utils/date-calculation.util");
class DayIterator {
    constructor(from, to) {
        this.currentDate = (0, interfaces_1.getFullDayDate)(from);
        this.toDate = (0, interfaces_1.getFullDayDate)(to);
    }
    [Symbol.iterator]() {
        let currentDate = this.currentDate;
        const toDate = this.toDate;
        return {
            next() {
                if (currentDate <= toDate) {
                    const result = { value: currentDate, done: false };
                    currentDate = (0, date_calculation_util_1.addDays)(currentDate, 1);
                    return result;
                }
                return { value: null, done: true };
            },
        };
    }
}
exports.DayIterator = DayIterator;
