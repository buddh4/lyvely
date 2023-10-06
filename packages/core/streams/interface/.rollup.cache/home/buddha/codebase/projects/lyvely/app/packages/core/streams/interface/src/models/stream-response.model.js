import { __decorate, __metadata } from "tslib";
import { BaseModel } from '@lyvely/common';
import { StreamState } from './stream-state.model';
import { Exclude, Expose, Type } from 'class-transformer';
let StreamResponse = class StreamResponse extends BaseModel {
};
__decorate([
    Expose(),
    __metadata("design:type", Array)
], StreamResponse.prototype, "models", void 0);
__decorate([
    Expose(),
    Type(() => StreamState),
    __metadata("design:type", Object)
], StreamResponse.prototype, "state", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Boolean)
], StreamResponse.prototype, "hasMore", void 0);
StreamResponse = __decorate([
    Exclude()
], StreamResponse);
export { StreamResponse };
