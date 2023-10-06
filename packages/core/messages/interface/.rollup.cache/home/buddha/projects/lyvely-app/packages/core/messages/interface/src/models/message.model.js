var MessageModel_1;
import { __decorate, __metadata } from "tslib";
import { ContentModel } from '@lyvely/content-interface';
import { Exclude, Expose } from 'class-transformer';
let MessageModel = MessageModel_1 = class MessageModel extends ContentModel {
    constructor() {
        super(...arguments);
        this.type = MessageModel_1.contentType;
    }
};
MessageModel.contentType = 'Message';
__decorate([
    Expose(),
    __metadata("design:type", Object)
], MessageModel.prototype, "type", void 0);
MessageModel = MessageModel_1 = __decorate([
    Exclude()
], MessageModel);
export { MessageModel };
