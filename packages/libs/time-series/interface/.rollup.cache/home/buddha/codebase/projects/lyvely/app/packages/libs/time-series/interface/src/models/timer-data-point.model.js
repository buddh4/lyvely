import { __decorate, __metadata } from "tslib";
import { Expose, Type } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import { DataPointValueType, } from '../interfaces';
import { BaseModel, PropertyType } from '@lyvely/common';
import { TimerModel } from '@lyvely/timers-interface';
import { IsNumber, Min, ValidateNested } from 'class-validator';
export class TimerDataPointValueModel extends BaseModel {
}
__decorate([
    Expose(),
    Type(() => TimerModel),
    PropertyType(TimerModel),
    ValidateNested(),
    __metadata("design:type", TimerModel)
], TimerDataPointValueModel.prototype, "timer", void 0);
__decorate([
    Expose(),
    IsNumber(),
    Min(0),
    PropertyType(Number, { default: 0 }),
    __metadata("design:type", Number)
], TimerDataPointValueModel.prototype, "ms", void 0);
export class TimerDataPointModel extends DataPointModel {
    constructor() {
        super(...arguments);
        this.valueType = DataPointValueType.Timer;
    }
    get numericValue() {
        return this.value.ms;
    }
}
__decorate([
    Expose(),
    Type(() => TimerDataPointValueModel),
    PropertyType(TimerDataPointValueModel),
    __metadata("design:type", TimerDataPointValueModel)
], TimerDataPointModel.prototype, "value", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Object)
], TimerDataPointModel.prototype, "valueType", void 0);
export function isTimerDataPointConfig(config) {
    return config.valueType === DataPointValueType.Timer;
}
