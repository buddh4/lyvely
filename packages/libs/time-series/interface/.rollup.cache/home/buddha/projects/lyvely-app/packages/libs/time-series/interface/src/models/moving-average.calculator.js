import { CalendarPlan, getTidWindow } from '@lyvely/calendar-plan-interface';
export class MovingAverageCalculator {
    constructor(windowSize) {
        this.windowSize = windowSize;
        this.values = [];
    }
    addValue(value) {
        this.values.push(value);
        if (this.values.length > this.windowSize) {
            this.values.shift();
        }
    }
    getMovingAverage() {
        const sum = this.values.reduce((acc, val) => acc + val, 0);
        return sum / this.values.length;
    }
    isFull() {
        return this.values.length === this.windowSize;
    }
    static calculateMovingAverage(summary, interval, locale, windowSize) {
        const calendarPlan = CalendarPlan.getInstance(interval);
        windowSize || (windowSize = calendarPlan.getDefaultWindowSize());
        const averageWindowSize = Math.min(windowSize, Math.ceil(summary.window.length / 2));
        const calculator = new MovingAverageCalculator(averageWindowSize);
        const tids = getTidWindow(interval, locale, windowSize);
        const values = [];
        const movingAverages = [];
        const differences = [];
        for (let i = 0; i < tids.length; i++) {
            const tid = tids[i];
            const { value } = summary.window.find((entry) => entry.tid === tid) || { value: 0 };
            values.push(value);
            calculator.addValue(value);
            if (calculator.isFull()) {
                movingAverages.push(calculator.getMovingAverage());
                differences.push(value - Math.min(...calculator.values));
            }
            else {
                movingAverages.push(null);
                differences.push(null);
            }
        }
        return { tids, values, movingAverages, differences, windowSize, averageWindowSize };
    }
    reset() {
        this.values = [];
    }
}
