import { __decorate, __metadata } from "tslib";
import { Expose } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateJournalModel } from './create-journal.model';
let UpdateJournalModel = class UpdateJournalModel extends PartialType(CreateJournalModel) {
    constructor(model) {
        super(model, false);
    }
};
UpdateJournalModel = __decorate([
    Expose(),
    __metadata("design:paramtypes", [Object])
], UpdateJournalModel);
export { UpdateJournalModel };
