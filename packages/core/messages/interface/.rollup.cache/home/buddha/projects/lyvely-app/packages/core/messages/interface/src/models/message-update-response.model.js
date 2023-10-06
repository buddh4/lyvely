import { __decorate, __metadata } from "tslib";
import { ContentUpdateResponse } from '@lyvely/content-interface';
import { MessageModel } from './message.model';
import { Expose, Type } from 'class-transformer';
import { PropertyType } from '@lyvely/common';
export class MessageUpdateResponse extends ContentUpdateResponse {
}
__decorate([
    Expose(),
    Type(() => MessageModel),
    PropertyType(MessageModel),
    __metadata("design:type", MessageModel)
], MessageUpdateResponse.prototype, "model", void 0);
