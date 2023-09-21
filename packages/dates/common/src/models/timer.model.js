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
exports.TimerModel = exports.TimeSpanModel = void 0;
const core_1 = require("@lyvely/core");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function compareSpans(a, b) {
    if (a.from < b.from)
        return -1;
    if (a.from > b.from)
        return 1;
    return 0;
}
let TimeSpanModel = class TimeSpanModel extends core_1.BaseModel {
    constructor(uid) {
        super();
        if (!this.from) {
            this.from = Date.now();
        }
        if (uid) {
            this.uid = uid;
        }
    }
};
__decorate([
    (0, core_1.TransformObjectId)(),
    __metadata("design:type", Object)
], TimeSpanModel.prototype, "uid", void 0);
TimeSpanModel = __decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:paramtypes", [Object])
], TimeSpanModel);
exports.TimeSpanModel = TimeSpanModel;
let TimerModel = class TimerModel extends core_1.BaseModel {
    start(uid) {
        if (this.isStarted())
            return;
        const span = new TimeSpanModel(uid);
        this.spans.push(span);
        return span;
    }
    stop() {
        const span = this.getLatestSpan();
        if (!span)
            return;
        span.to = Date.now();
    }
    overwrite(newValue, uid) {
        if (newValue === 0) {
            this.spans = [];
            return;
        }
        const currentValueWithoutOpenSpan = this.calculateTotalSpan(false);
        const latestSpan = this.getLatestSpan();
        if (newValue > currentValueWithoutOpenSpan) {
            const diff = newValue - currentValueWithoutOpenSpan;
            if (!this.isStarted()) {
                if (latestSpan) {
                    latestSpan.to += diff;
                }
                else {
                    const newSpan = this.start(uid);
                    if (newSpan) {
                        newSpan.from = Date.now() - diff;
                        newSpan.to = newSpan.from + diff;
                    }
                }
            }
            else if (latestSpan) {
                latestSpan.to = latestSpan.from + diff;
            }
        }
        else {
            let currentValue = 0;
            const newSpans = [];
            for (let i = 0; i < this.spans.length; i++) {
                const currSpan = this.spans[i];
                const timeSpan = this.calculateSpan(this.spans[i], false);
                if (currentValue + timeSpan >= newValue) {
                    currSpan.to = currSpan.from + (newValue - currentValue);
                    newSpans.push(currSpan);
                    break;
                }
                else {
                    newSpans.push(currSpan);
                    currentValue += timeSpan;
                }
            }
            this.spans = newSpans;
        }
    }
    getLatestSpan() {
        if (!this.spans?.length)
            return;
        return this.spans.sort(compareSpans)[this.spans.length - 1];
    }
    isStarted() {
        const span = this.getLatestSpan();
        return !!span && !span.to;
    }
    calculateTotalSpan(includeOpenSpan = true) {
        return (this.spans?.reduce((val, curr) => val + this.calculateSpan(curr, includeOpenSpan), 0) ?? 0);
    }
    calculateSpan(span, includeOpenSpan = true) {
        if (span.to) {
            return span.to - span.from;
        }
        else if (includeOpenSpan) {
            return Date.now() - span.from;
        }
        return 0;
    }
};
__decorate([
    (0, core_1.TransformObjectId)(),
    __metadata("design:type", Object)
], TimerModel.prototype, "uid", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => TimeSpanModel),
    (0, core_1.PropertyType)([TimeSpanModel]),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], TimerModel.prototype, "spans", void 0);
TimerModel = __decorate([
    (0, class_transformer_1.Expose)()
], TimerModel);
exports.TimerModel = TimerModel;
