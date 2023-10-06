var HabitModel_1;
import { __decorate } from "tslib";
import { Expose } from 'class-transformer';
import { UpdateHabitModel } from './update-habit.model';
import { UserAssignmentStrategy } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import { DataPointInputType, DataPointValueType, TimeSeriesContentModel, useDataPointStrategyFacade, } from '@lyvely/time-series-interface';
let HabitModel = HabitModel_1 = class HabitModel extends TimeSeriesContentModel {
    constructor() {
        super(...arguments);
        this.type = HabitModel_1.contentType;
    }
    getDefaultConfig() {
        return {
            score: 0,
            timeSeries: {
                interval: CalendarInterval.Daily,
                inputType: DataPointInputType.Checkbox,
                valueType: DataPointValueType.Number,
                userStrategy: UserAssignmentStrategy.Shared,
                history: [],
            },
        };
    }
    toEditModel() {
        const editModel = new UpdateHabitModel({
            title: this.content.title,
            text: this.content.text,
            score: this.config.score,
        });
        useDataPointStrategyFacade().populateDataPointConfig(editModel, this.timeSeriesConfig);
        return editModel;
    }
};
HabitModel.contentType = 'Habit';
HabitModel = HabitModel_1 = __decorate([
    Expose()
], HabitModel);
export { HabitModel };
