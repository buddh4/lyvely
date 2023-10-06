var JournalModel_1;
import { __decorate } from "tslib";
import { Expose } from 'class-transformer';
import { DataPointInputType, DataPointValueType, TimeSeriesContentModel, useDataPointStrategyFacade, } from '@lyvely/time-series-interface';
import { CalendarInterval } from '@lyvely/dates';
import { UserAssignmentStrategy } from '@lyvely/common';
import { UpdateJournalModel } from './update-journal.model';
let JournalModel = JournalModel_1 = class JournalModel extends TimeSeriesContentModel {
    constructor() {
        super(...arguments);
        this.type = JournalModel_1.contentType;
    }
    getDefaultConfig() {
        return {
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
        const editModel = new UpdateJournalModel({
            title: this.content.title,
            text: this.content.text,
        });
        useDataPointStrategyFacade().populateDataPointConfig(editModel, this.timeSeriesConfig);
        return editModel;
    }
};
JournalModel.contentType = 'Journal';
JournalModel = JournalModel_1 = __decorate([
    Expose()
], JournalModel);
export { JournalModel };
