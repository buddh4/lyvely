"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentModel = exports.BaseModel = exports.implementsAfterInit = exports.implementsGetDefaults = void 0;
const class_transformer_1 = require("class-transformer");
const util_1 = require("./util");
function implementsGetDefaults(model) {
    return typeof model.getDefaults === 'function';
}
exports.implementsGetDefaults = implementsGetDefaults;
function implementsAfterInit(model) {
    return typeof model.afterInit === 'function';
}
exports.implementsAfterInit = implementsAfterInit;
class BaseModel {
    constructor(obj) {
        if (implementsGetDefaults(this)) {
            obj = obj ? Object.assign(this.getDefaults(), obj) : this.getDefaults();
        }
        (0, util_1.assignRawDataToAndInitProps)(this, obj);
        if (implementsAfterInit(this)) {
            this.afterInit();
        }
    }
}
exports.BaseModel = BaseModel;
class DocumentModel extends BaseModel {
    constructor(obj) {
        if (!obj) {
            super();
            return;
        }
        if (obj && 'toJSON' in obj && typeof obj.toJSON === 'function') {
            obj = obj.toJSON();
        }
        if ('_id' in obj && typeof obj['_id'] === 'object') {
            obj['id'] = obj['_id'].toString();
        }
        super(obj);
    }
}
exports.DocumentModel = DocumentModel;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value, obj }) => obj._id?.toString() || value),
    __metadata("design:type", String)
], DocumentModel.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], DocumentModel.prototype, "_id", void 0);
