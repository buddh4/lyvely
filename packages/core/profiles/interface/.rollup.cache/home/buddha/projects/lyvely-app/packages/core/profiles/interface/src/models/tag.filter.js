import { escapeRegExp } from 'lodash';
export class TagFilter {
    constructor(obj) {
        Object.assign(this, obj);
    }
    isActive() {
        var _a, _b, _c;
        return (((_a = this.query) === null || _a === void 0 ? void 0 : _a.length) || ((_b = this.nameSelection) === null || _b === void 0 ? void 0 : _b.length) || ((_c = this.idSelection) === null || _c === void 0 ? void 0 : _c.length) || this.archived);
    }
    apply(tags) {
        if (!tags || !tags.length) {
            return [];
        }
        return ((tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
            var _a, _b, _c;
            if (((_a = this.query) === null || _a === void 0 ? void 0 : _a.length) && !tag.name.match(new RegExp(escapeRegExp(this.query), 'i'))) {
                return false;
            }
            if (this.archived === true && !tag.archived) {
                return false;
            }
            if (this.archived === false && tag.archived) {
                return false;
            }
            if (((_b = this.idSelection) === null || _b === void 0 ? void 0 : _b.length) && !this.idSelection.includes(tag.id)) {
                return false;
            }
            if (((_c = this.nameSelection) === null || _c === void 0 ? void 0 : _c.length) && !this.nameSelection.includes(tag.name)) {
                return false;
            }
            return true;
        })) || []);
    }
}
