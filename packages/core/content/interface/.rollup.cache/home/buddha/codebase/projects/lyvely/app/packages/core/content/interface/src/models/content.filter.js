import { escapeRegExp } from 'lodash';
import { Filter } from '@lyvely/common';
export class ContentFilter extends Filter {
    constructor(options) {
        const tagProvider = options === null || options === void 0 ? void 0 : options.tagProvider;
        options === null || options === void 0 ? true : delete options.tagProvider;
        super(options);
        if (tagProvider) {
            this.setTagProvider(tagProvider);
        }
    }
    setTagProvider(provider) {
        if (this.tagProvider)
            return;
        this.tagProvider = provider;
        const tagAddition = (model, filter) => {
            const includeOnlyOnFilterTags = filter.tagProvider().filter((tag) => tag.includeOnFilter && model.tagIds.includes(tag.id));
            return !(filter.isEmpty() && includeOnlyOnFilterTags.length);
        };
        this.additions.push(tagAddition);
    }
    getDefaultOptions() {
        return { archived: false };
    }
    checkModel(model) {
        var _a, _b;
        if (this.options.type && this.options.type !== model.type) {
            return false;
        }
        if (this.options.tagId && !((_a = model.tagIds) === null || _a === void 0 ? void 0 : _a.includes(this.options.tagId))) {
            return false;
        }
        if (((_b = this.options.query) === null || _b === void 0 ? void 0 : _b.length) &&
            !((model.content.title || '') + (model.content.text || '')).match(new RegExp(escapeRegExp(this.options.query), 'i'))) {
            return false;
        }
        return !!this.options.archived === !!model.meta.archived;
    }
    isEmpty() {
        var _a;
        return !this.options.tagId && !this.options.archived && !((_a = this.options.query) === null || _a === void 0 ? void 0 : _a.length);
    }
}
