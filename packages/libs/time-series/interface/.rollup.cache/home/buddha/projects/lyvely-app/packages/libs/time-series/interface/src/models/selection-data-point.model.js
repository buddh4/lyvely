import { __decorate, __metadata } from "tslib";
import { Expose, Type } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import { DataPointValueType } from '../interfaces';
import { BaseModel, PropertyType } from '@lyvely/common';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
let SelectionDataPointValueModel = class SelectionDataPointValueModel extends BaseModel {
};
__decorate([
    IsString({ each: true }),
    MaxLength(250, { each: true }),
    PropertyType([String]),
    __metadata("design:type", Array)
], SelectionDataPointValueModel.prototype, "selection", void 0);
__decorate([
    IsString(),
    MaxLength(250),
    IsOptional(),
    __metadata("design:type", String)
], SelectionDataPointValueModel.prototype, "otherValue", void 0);
SelectionDataPointValueModel = __decorate([
    Expose()
], SelectionDataPointValueModel);
export { SelectionDataPointValueModel };
let SelectionDataPointModel = class SelectionDataPointModel extends DataPointModel {
    constructor() {
        super(...arguments);
        this.valueType = DataPointValueType.Selection;
    }
};
__decorate([
    Type(() => SelectionDataPointValueModel),
    PropertyType(SelectionDataPointValueModel),
    __metadata("design:type", Object)
], SelectionDataPointModel.prototype, "value", void 0);
__decorate([
    IsEnum([DataPointValueType.Selection]),
    __metadata("design:type", Object)
], SelectionDataPointModel.prototype, "valueType", void 0);
SelectionDataPointModel = __decorate([
    Expose()
], SelectionDataPointModel);
export { SelectionDataPointModel };
export function isSelectionDataPointConfig(config) {
    return config.valueType === DataPointValueType.Selection;
}
