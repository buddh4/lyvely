import { __decorate, __metadata } from "tslib";
import { Expose } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import { DataPointValueType } from '../interfaces';
export class TextDataPointModel extends DataPointModel {
    constructor() {
        super(...arguments);
        this.valueType = DataPointValueType.Text;
    }
    afterInit() {
        var _a;
        this.value = (_a = this.value) !== null && _a !== void 0 ? _a : '';
    }
}
__decorate([
    Expose(),
    __metadata("design:type", String)
], TextDataPointModel.prototype, "value", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Object)
], TextDataPointModel.prototype, "valueType", void 0);
export function isTextDataPointConfig(config) {
    return config.valueType === DataPointValueType.Text;
}
