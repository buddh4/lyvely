import { CalendarInterval, getLocalizedDays, getLocalizedMonths } from '@lyvely/dates';
import { CalendarPlan } from '@lyvely/calendar-plan-interface';
class Statistics {
}
export class ScoreStatistics extends Statistics {
    constructor(obj) {
        super();
        this.title = obj.title || this.title;
        this.data = obj.data || this.data;
        this.interval = obj.interval || this.interval;
    }
    getChart() {
        return {
            type: 'bar',
            data: {
                labels: this.getChartLabels(),
                datasets: [
                    {
                        label: 'score',
                        backgroundColor: 'rgb(25, 135, 84)',
                        borderColor: 'rgb(255, 170, 100)',
                        data: this.getData(),
                    },
                ],
                borderWidth: 1,
            },
            options: {},
        };
    }
    getData() {
        var _a;
        const result = [];
        (_a = this.getDataSetIds()) === null || _a === void 0 ? void 0 : _a.forEach((id) => {
            result.push(this.getScore(id));
        });
        return result;
    }
    getDataSetIds() {
        switch (this.interval) {
            case CalendarInterval.Monthly:
                return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11];
            case CalendarInterval.Daily:
                return [0, 1, 2, 3, 4, 5, 6, 7];
        }
    }
    getScore(dataSetId) {
        const dataset = this.data.find((dataset) => dataset.id === dataSetId);
        if (dataset) {
            return dataset.score;
        }
        return 0;
    }
    getChartLabels() {
        switch (this.interval) {
            case CalendarInterval.Monthly:
                return getLocalizedMonths('short');
            case CalendarInterval.Daily:
                return getLocalizedDays('short');
        }
        return [];
    }
    getLabelByDatasetId(id) {
        return CalendarPlan.getInstance(this.interval).getLabelById(id);
    }
}
