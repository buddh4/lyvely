import { __decorate, __metadata } from "tslib";
import { BaseModel, PropertyType, TransformObjectId } from '@lyvely/common';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
function compareSpans(a, b) {
    if (a.from < b.from)
        return -1;
    if (a.from > b.from)
        return 1;
    return 0;
}
let TimeSpanModel = class TimeSpanModel extends BaseModel {
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
    TransformObjectId(),
    __metadata("design:type", Object)
], TimeSpanModel.prototype, "uid", void 0);
TimeSpanModel = __decorate([
    Expose(),
    __metadata("design:paramtypes", [Object])
], TimeSpanModel);
export { TimeSpanModel };
let TimerModel = class TimerModel extends BaseModel {
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
                    newSpan.from = Date.now() - diff;
                    newSpan.to = newSpan.from + diff;
                }
            }
            else {
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
        var _a;
        if (!((_a = this.spans) === null || _a === void 0 ? void 0 : _a.length))
            return;
        return this.spans.sort(compareSpans)[this.spans.length - 1];
    }
    isStarted() {
        const span = this.getLatestSpan();
        return !!span && !span.to;
    }
    calculateTotalSpan(includeOpenSpan = true) {
        var _a, _b;
        return ((_b = (_a = this.spans) === null || _a === void 0 ? void 0 : _a.reduce((val, curr) => val + this.calculateSpan(curr, includeOpenSpan), 0)) !== null && _b !== void 0 ? _b : 0);
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
    TransformObjectId(),
    __metadata("design:type", Object)
], TimerModel.prototype, "uid", void 0);
__decorate([
    Type(() => TimeSpanModel),
    PropertyType([TimeSpanModel]),
    ValidateNested(),
    __metadata("design:type", Array)
], TimerModel.prototype, "spans", void 0);
TimerModel = __decorate([
    Expose()
], TimerModel);
export { TimerModel };
