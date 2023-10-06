import { __decorate, __metadata } from "tslib";
import { Expose, Type } from 'class-transformer';
import { TagModel } from '@lyvely/profiles-interface';
let ContentUpdateResponse = class ContentUpdateResponse {
};
__decorate([
    Type(() => TagModel),
    __metadata("design:type", Array)
], ContentUpdateResponse.prototype, "tags", void 0);
ContentUpdateResponse = __decorate([
    Expose()
], ContentUpdateResponse);
export { ContentUpdateResponse };
