import { __decorate, __metadata } from "tslib";
import { Transform, Expose, Exclude } from 'class-transformer';
import { assignRawDataToAndInitProps } from './util';
export function implementsGetDefaults(model) {
    return typeof model.getDefaults === 'function';
}
export function implementsAfterInit(model) {
    return typeof model.afterInit === 'function';
}
export function implementsToJson(model) {
    return typeof model.toJSON === 'function';
}
export class BaseModel {
    constructor(obj) {
        if (implementsGetDefaults(this)) {
            obj = obj ? Object.assign(this.getDefaults(), obj) : this.getDefaults();
        }
        assignRawDataToAndInitProps(this, obj);
        if (implementsAfterInit(this)) {
            this.afterInit();
        }
    }
}
export class DocumentModel extends BaseModel {
    constructor(obj) {
        if (!obj) {
            super();
            return;
        }
        if (implementsToJson(obj)) {
            obj = obj.toJSON();
        }
        if ('_id' in obj && typeof obj['_id'] === 'object') {
            obj['id'] = obj['_id'].toString();
        }
        super(obj);
    }
}
__decorate([
    Expose(),
    Transform(({ value, obj }) => { var _a; return ((_a = obj._id) === null || _a === void 0 ? void 0 : _a.toString()) || value; }),
    __metadata("design:type", String)
], DocumentModel.prototype, "id", void 0);
__decorate([
    Exclude(),
    __metadata("design:type", Object)
], DocumentModel.prototype, "_id", void 0);
