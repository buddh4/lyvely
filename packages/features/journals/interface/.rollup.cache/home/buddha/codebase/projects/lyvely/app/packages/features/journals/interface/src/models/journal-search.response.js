import { __decorate, __metadata } from "tslib";
import { Type, Expose } from 'class-transformer';
import { JournalModel } from './journal.model';
import { BaseModel, PropertyType } from '@lyvely/common';
let JournalSearchResponse = class JournalSearchResponse extends BaseModel {
};
__decorate([
    Expose(),
    Type(() => JournalModel),
    PropertyType([JournalModel]),
    __metadata("design:type", Array)
], JournalSearchResponse.prototype, "models", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Array)
], JournalSearchResponse.prototype, "dataPoints", void 0);
JournalSearchResponse = __decorate([
    Expose()
], JournalSearchResponse);
export { JournalSearchResponse };
