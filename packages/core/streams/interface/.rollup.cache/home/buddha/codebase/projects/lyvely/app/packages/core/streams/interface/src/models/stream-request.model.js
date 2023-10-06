import { __decorate, __metadata } from "tslib";
import { BaseModel } from '@lyvely/common';
import { StreamState } from './stream-state.model';
import { Expose, Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';
let StreamRequest = class StreamRequest extends BaseModel {
    isInitialRequest() {
        var _a;
        return !((_a = this.state) === null || _a === void 0 ? void 0 : _a.headIds);
    }
};
__decorate([
    Type(() => StreamState),
    __metadata("design:type", Object)
], StreamRequest.prototype, "state", void 0);
__decorate([
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], StreamRequest.prototype, "batchSize", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Object)
], StreamRequest.prototype, "filter", void 0);
StreamRequest = __decorate([
    Expose()
], StreamRequest);
export { StreamRequest };
