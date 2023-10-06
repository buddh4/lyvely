var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
//# sourceMappingURL=sortable.interface.js.map