import { __decorate, __metadata } from "tslib";
import { Expose } from 'class-transformer';
import { BaseModel } from '@lyvely/common';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
let ContentStreamFilter = class ContentStreamFilter extends BaseModel {
    toggleTag(id) {
        if (this.isActiveTag(id)) {
            this.removeTagId(id);
        }
        else {
            this.addTagId(id);
        }
    }
    isActiveTag(id) {
        var _a;
        return (_a = this.tagIds) === null || _a === void 0 ? void 0 : _a.find((tid) => tid === id);
    }
    setTagIds(ids) {
        this.tagIds = ids;
    }
    addTagId(id) {
        if (!this.tagIds) {
            this.tagIds = [];
        }
        this.tagIds.push(id);
    }
    removeTagId(id) {
        if (!this.tagIds)
            return;
        const tagIndex = this.tagIds.findIndex((tid) => id === tid);
        if (tagIndex === -1)
            return;
        this.tagIds.splice(tagIndex, 1);
    }
    isEmpty() {
        var _a, _b;
        return !((_a = this.tagIds) === null || _a === void 0 ? void 0 : _a.length) && !((_b = this.query) === null || _b === void 0 ? void 0 : _b.length) && !this.archived;
    }
    getQueryKeys() {
        return ['archived', 'query', 'tagIds'];
    }
    getQuery() {
        var _a, _b;
        const query = {};
        if (this.archived)
            query['archived'] = 'true';
        if ((_a = this.query) === null || _a === void 0 ? void 0 : _a.length)
            query['query'] = this.query;
        if ((_b = this.tagIds) === null || _b === void 0 ? void 0 : _b.length)
            query['tagIds'] = this.tagIds;
        return query;
    }
    mergeQuery(query) {
        const result = Object.assign({}, query);
        const filterQuery = this.getQuery();
        this.getQueryKeys().forEach((key) => {
            if (!filterQuery[key]) {
                delete result[key];
            }
            else {
                result[key] = filterQuery[key];
            }
        });
        return result;
    }
    fromQuery(query) {
        var _a, _b;
        if (query.archived)
            this.archived = true;
        if ((_a = query.query) === null || _a === void 0 ? void 0 : _a.length)
            this.query = query.query;
        if ((_b = query.tagIds) === null || _b === void 0 ? void 0 : _b.length)
            this.tagIds = Array.isArray(query.tagIds) ? query.tagIds : [query.tagIds];
    }
    reset() {
        delete this.tagIds;
        delete this.query;
        delete this.archived;
    }
};
__decorate([
    IsMongoId(),
    IsOptional(),
    __metadata("design:type", String)
], ContentStreamFilter.prototype, "parentId", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], ContentStreamFilter.prototype, "archived", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], ContentStreamFilter.prototype, "query", void 0);
__decorate([
    IsMongoId({ each: true }),
    IsOptional(),
    __metadata("design:type", Array)
], ContentStreamFilter.prototype, "tagIds", void 0);
ContentStreamFilter = __decorate([
    Expose()
], ContentStreamFilter);
export { ContentStreamFilter };
