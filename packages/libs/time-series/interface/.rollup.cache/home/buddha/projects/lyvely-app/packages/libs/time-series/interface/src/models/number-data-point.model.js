import { __decorate, __metadata } from "tslib";
import { Expose } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import { DataPointValueType, } from '../interfaces';
export class NumberDataPointModel extends DataPointModel {
    constructor() {
        super(...arguments);
        this.valueType = DataPointValueType.Number;
    }
    get numericValue() {
        return this.value;
    }
    afterInit() {
        var _a;
        this.value = (_a = this.value) !== null && _a !== void 0 ? _a : 0;
    }
}
__decorate([
    Expose(),
    __metadata("design:type", Number)
], NumberDataPointModel.prototype, "value", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Object)
], NumberDataPointModel.prototype, "valueType", void 0);
export function isNumberDataPointConfig(config) {
    return config.valueType === DataPointValueType.Number;
}
