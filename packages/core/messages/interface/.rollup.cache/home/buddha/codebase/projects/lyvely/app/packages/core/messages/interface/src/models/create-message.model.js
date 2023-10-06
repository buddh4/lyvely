import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { MESSAGE_MAX_LENGTH } from '../message.constants';
import { CreateContentModel } from '@lyvely/content-interface';
let CreateMessage = class CreateMessage extends CreateContentModel {
    constructor(text, parentId) {
        super({ text, parentId });
    }
};
__decorate([
    Expose(),
    IsString(),
    Length(1, MESSAGE_MAX_LENGTH),
    __metadata("design:type", String)
], CreateMessage.prototype, "text", void 0);
CreateMessage = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [String, String])
], CreateMessage);
export { CreateMessage };
