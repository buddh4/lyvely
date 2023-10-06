var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
//# sourceMappingURL=base.model.js.map