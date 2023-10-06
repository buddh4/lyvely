var MilestoneModel_1;
import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { CalendarInterval } from '@lyvely/dates';
import { UpdateMilestoneModel } from './update-milestone.model';
import { ContentModel } from '@lyvely/content';
let MilestoneModel = MilestoneModel_1 = class MilestoneModel extends ContentModel {
    constructor() {
        super(...arguments);
        this.type = MilestoneModel_1.contentType;
    }
    get interval() {
        return this.config.interval;
    }
    set interval(interval) {
        this.config.interval = interval;
    }
    getDefaultConfig() {
        return {
            interval: CalendarInterval.Daily,
        };
    }
    toEditModel() {
        return new UpdateMilestoneModel({
            title: this.content.title,
            text: this.content.text,
            interval: this.config.interval,
        });
    }
};
MilestoneModel.contentType = 'Milestone';
__decorate([
    Expose(),
    __metadata("design:type", Object)
], MilestoneModel.prototype, "type", void 0);
MilestoneModel = MilestoneModel_1 = __decorate([
    Exclude()
], MilestoneModel);
export { MilestoneModel };
