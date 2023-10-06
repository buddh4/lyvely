import { __decorate, __metadata } from "tslib";
import { StreamResponse } from '@lyvely/streams-interface';
import { Expose, Type } from 'class-transformer';
import { WebNotification } from './web-notification.model';
export class NotificationStreamResponse extends StreamResponse {
}
__decorate([
    Expose(),
    Type(() => WebNotification),
    __metadata("design:type", Array)
], NotificationStreamResponse.prototype, "models", void 0);
