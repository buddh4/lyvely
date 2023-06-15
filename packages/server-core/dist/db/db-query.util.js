"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBQuery = void 0;
class DBQuery {
    static or(conditions) {
        if (!conditions?.length)
            return {};
        if (conditions.length === 1)
            return conditions[0];
        return { $or: Object.assign({}, ...conditions) };
    }
    static and(conditions) {
        if (!conditions?.length)
            return {};
        if (conditions.length === 1)
            return conditions[0];
        return Object.assign({}, ...conditions);
    }
}
exports.DBQuery = DBQuery;
