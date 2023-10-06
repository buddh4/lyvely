import { __decorate, __metadata } from "tslib";
import { Exclude, Expose, Type } from 'class-transformer';
import { PropertyType } from '../decorators';
import { BaseModel } from '../base.model';
let SortResult = class SortResult extends BaseModel {
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], SortResult.prototype, "id", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], SortResult.prototype, "sortOrder", void 0);
SortResult = __decorate([
    Exclude()
], SortResult);
export { SortResult };
let SortResponse = class SortResponse extends BaseModel {
};
__decorate([
    Type(() => SortResult),
    PropertyType([SortResult]),
    __metadata("design:type", Array)
], SortResponse.prototype, "sort", void 0);
SortResponse = __decorate([
    Expose()
], SortResponse);
export { SortResponse };
export function sortBySortOrder(a, b) {
    if (a.getSortOrder() === b.getSortOrder())
        return 0;
    if (typeof a.getSortOrder() === 'undefined')
        return 1;
    if (typeof b.getSortOrder() === 'undefined')
        return -1;
    return (a.getSortOrder() || 0) - (b.getSortOrder() || 0);
}
