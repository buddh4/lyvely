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
exports.assignEntityData = exports.BaseEntity = void 0;
const class_transformer_1 = require("class-transformer");
const mongoose_1 = require("mongoose");
const common_1 = require("@lyvely/common");
class BaseEntity {
    constructor(obj) {
        if (obj !== false) {
            this.init(obj);
        }
    }
    init(obj) {
        if ('getDefaults' in this && typeof this.getDefaults === 'function') {
            const defaultValues = this.getDefaults();
            if (defaultValues) {
                obj = Object.assign(defaultValues, obj);
            }
        }
        assignEntityData(this, obj);
        this.afterInit();
    }
    afterInit() {
    }
}
exports.BaseEntity = BaseEntity;
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], BaseEntity.prototype, "_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], BaseEntity.prototype, "id", void 0);
function assignEntityData(instance, obj) {
    if (obj) {
        if (obj instanceof mongoose_1.Document) {
            (0, common_1.assignRawDataToAndInitProps)(instance, obj.toObject());
        }
        else {
            (0, common_1.assignRawDataToAndInitProps)(instance, obj);
        }
    }
    else {
        (0, common_1.assignRawDataToAndInitProps)(instance);
    }
    if (instance instanceof BaseEntity && instance._id && !instance.id) {
        instance.id = instance._id.toString();
    }
    return instance;
}
exports.assignEntityData = assignEntityData;
