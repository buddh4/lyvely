import { __decorate } from "tslib";
import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateTagModel } from './create-tag.model';
let UpdateTagModel = class UpdateTagModel extends PartialType(CreateTagModel) {
};
UpdateTagModel = __decorate([
    Exclude()
], UpdateTagModel);
export { UpdateTagModel };
