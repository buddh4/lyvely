var SystemMessageModel_1;
import { __decorate, __metadata } from "tslib";
import { ContentDataTypeModel, ContentModel } from '@lyvely/content-interface';
import { Exclude, Expose } from 'class-transformer';
import { PropertyType } from '@lyvely/common';
let SystemMessageContent = class SystemMessageContent extends ContentDataTypeModel {
};
__decorate([
    Expose(),
    __metadata("design:type", Object)
], SystemMessageContent.prototype, "params", void 0);
SystemMessageContent = __decorate([
    Exclude()
], SystemMessageContent);
export { SystemMessageContent };
let SystemMessageModel = SystemMessageModel_1 = class SystemMessageModel extends ContentModel {
    constructor() {
        super(...arguments);
        this.type = SystemMessageModel_1.contentType;
    }
};
SystemMessageModel.contentType = 'SystemMessage';
__decorate([
    Expose(),
    PropertyType(SystemMessageContent),
    __metadata("design:type", SystemMessageContent)
], SystemMessageModel.prototype, "content", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Object)
], SystemMessageModel.prototype, "type", void 0);
SystemMessageModel = SystemMessageModel_1 = __decorate([
    Exclude()
], SystemMessageModel);
export { SystemMessageModel };
