import { CalendarPlan, CalendarIntervalEnum, getMonthNames } from "../calendar";

abstract class Statistics {
    title: string;
    data: any[];
}

export interface ScoreStatisticsDataset {
    id: string,
    score: number
}

export class ScoreStatistics extends Statistics {
    data: ScoreStatisticsDataset[];
    interval: CalendarIntervalEnum;

    constructor(obj: Partial<ScoreStatistics>) {
        super();
        this.title = obj.title;
        this.data = obj.data;
        this.interval = obj.interval;
    }

    getChart() {
        return {
            type: 'bar',
            data: {
                labels: this.getChartLabels(),
                datasets:  [{
                    label: 'score',
                    backgroundColor: "rgb(25, 135, 84)",
                    borderColor: "rgb(255, 170, 100)",
                    data: this.getData()
                }],

                borderWidth: 1
            },
            options: {}
        }
    }

    getData() {
        let result = [];
        this.getDataSetIds().forEach((id) => {
            result.push(this.getScore(id));
        })
        return result;
    }

    getDataSetIds() {
        switch (this.interval) {
            case CalendarIntervalEnum.Monthly: {
                return [0,1,2,3,4,5,6,7,8,9,0,11]
            }
        }
    }

    getScore(dataSetId: any) {
        let dataset = this.data.find(dataset => dataset.id === dataSetId);
        if(dataset) {
            return dataset.score;
        }

        return 0;
    }

    getChartLabels() {
        switch (this.interval) {
            case CalendarIntervalEnum.Monthly:
                return getMonthNames(true)
        }

        return [];
    }

    getLabelByDatasetId(id: string) {
        return CalendarPlan.getInstance(this.interval).getLabelById(id);
    }

}