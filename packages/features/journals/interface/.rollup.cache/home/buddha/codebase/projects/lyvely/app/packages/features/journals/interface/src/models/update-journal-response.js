import { __decorate, __metadata } from "tslib";
import { Expose, Type } from 'class-transformer';
import { TagModel } from '@lyvely/profiles';
import { PropertyType } from '@lyvely/common';
import { ContentUpdateResponse } from '@lyvely/content';
import { JournalModel } from './journal.model';
export class UpdateJournalResponse extends ContentUpdateResponse {
}
__decorate([
    Expose(),
    Type(() => JournalModel),
    PropertyType(JournalModel),
    __metadata("design:type", JournalModel)
], UpdateJournalResponse.prototype, "model", void 0);
__decorate([
    Expose(),
    Type(() => TagModel),
    PropertyType([TagModel]),
    __metadata("design:type", Array)
], UpdateJournalResponse.prototype, "tags", void 0);
