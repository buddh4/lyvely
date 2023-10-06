import { __decorate, __metadata } from "tslib";
import { Expose } from 'class-transformer';
import { PropertyType } from '@lyvely/common';
import { UpdateDataPointResponse, DataPointModel } from '@lyvely/time-series-interface';
import { JournalModel } from './journal.model';
let UpdateJournalDataPointResponse = class UpdateJournalDataPointResponse extends UpdateDataPointResponse {
};
__decorate([
    PropertyType(DataPointModel),
    __metadata("design:type", DataPointModel)
], UpdateJournalDataPointResponse.prototype, "dataPoint", void 0);
__decorate([
    PropertyType(JournalModel),
    __metadata("design:type", JournalModel)
], UpdateJournalDataPointResponse.prototype, "model", void 0);
UpdateJournalDataPointResponse = __decorate([
    Expose()
], UpdateJournalDataPointResponse);
export { UpdateJournalDataPointResponse };
