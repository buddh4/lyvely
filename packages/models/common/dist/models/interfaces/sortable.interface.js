"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortBySortOrder = exports.SortResponse = exports.SortResult = void 0;
const class_transformer_1 = require("class-transformer");
const decorators_1 = require("../decorators");
const base_model_1 = require("../base.model");
let SortResult = class SortResult extends base_model_1.BaseModel {
};
exports.SortResult = SortResult;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], SortResult.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], SortResult.prototype, "sortOrder", void 0);
exports.SortResult = SortResult = __decorate([
    (0, class_transformer_1.Exclude)()
], SortResult);
let SortResponse = class SortResponse extends base_model_1.BaseModel {
};
exports.SortResponse = SortResponse;
__decorate([
    (0, class_transformer_1.Type)(() => SortResult),
    (0, decorators_1.PropertyType)([SortResult]),
    __metadata("design:type", Array)
], SortResponse.prototype, "sort", void 0);
exports.SortResponse = SortResponse = __decorate([
    (0, class_transformer_1.Expose)()
], SortResponse);
function sortBySortOrder(a, b) {
    if (a.getSortOrder() === b.getSortOrder())
        return 0;
    if (typeof a.getSortOrder() === 'undefined')
        return 1;
    if (typeof b.getSortOrder() === 'undefined')
        return -1;
    return (a.getSortOrder() || 0) - (b.getSortOrder() || 0);
}
exports.sortBySortOrder = sortBySortOrder;
