"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBaseEntityInstance = exports.assureStringId = exports.applyRawDataTo = exports.applyPush = exports.applyInc = exports.applyUpdateTo = exports.assureObjectId = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = require("./base.entity");
const common_1 = require("@lyvely/common");
function assureObjectId(identity, optional) {
    if (!identity && optional)
        return undefined;
    if (typeof identity === 'string') {
        if ((0, common_1.isValidObjectId)(identity)) {
            return new mongoose_1.Types.ObjectId(identity);
        }
        throw new common_1.IntegrityException('Use of invalid object id detected.');
    }
    if (identity instanceof mongoose_1.Types.ObjectId) {
        return identity;
    }
    if (identity &&
        '_id' in identity &&
        (typeof identity['_id'] === 'string' || identity['_id'] instanceof mongoose_1.Types.ObjectId)) {
        return assureObjectId(identity['_id']);
    }
    if (identity && 'id' in identity && typeof identity['id'] === 'string') {
        return assureObjectId(identity['id']);
    }
    throw new common_1.IntegrityException('Use of invalid object id detected.');
}
exports.assureObjectId = assureObjectId;
function applyUpdateTo(identity, update) {
    if (typeof identity !== 'object') {
        return;
    }
    if ('$inc' in update) {
        applyInc(identity, update['$inc']);
    }
    if ('$set' in update) {
        applyRawDataTo(identity, update['$set']);
    }
    if ('$push' in update) {
        applyPush(identity, update['$push']);
    }
}
exports.applyUpdateTo = applyUpdateTo;
function applyInc(model, incData) {
    Object.keys(incData).forEach((path) => {
        if (typeof incData[path] !== 'number') {
            return;
        }
        let modelToInc = model;
        let fieldToInc = path;
        if (path.includes('.') && path.lastIndexOf('.') !== path.length - 1) {
            fieldToInc = path.slice(path.lastIndexOf('.') + 1);
            modelToInc = (0, common_1.findByPath)(model, path, true);
        }
        if (modelToInc && typeof modelToInc[fieldToInc] === 'number') {
            modelToInc[fieldToInc] += incData[path];
        }
    });
}
exports.applyInc = applyInc;
function applyPush(model, pushData) {
    Object.keys(pushData).forEach((key) => {
        if (typeof model[key] === 'undefined') {
            model[key] = [];
        }
        if (pushData[key] &&
            typeof pushData[key] === 'object' &&
            '$each' in pushData[key] &&
            Array.isArray(pushData[key][`$each`])) {
            model[key] = [...model[key], ...pushData[key][`$each`]];
        }
        else {
            model[key].push(pushData[key]);
        }
    });
    return model;
}
exports.applyPush = applyPush;
function applyRawDataTo(model, data, { maxDepth = 100, strict = false } = {}) {
    return (0, common_1.assignRawDataTo)(model, data, { maxDepth, strict });
}
exports.applyRawDataTo = applyRawDataTo;
function assureStringId(obj, optional = false) {
    if (!obj && !optional) {
        throw new common_1.IntegrityException('Cannot assure string id on undefined.');
    }
    else if (!obj) {
        return undefined;
    }
    if (typeof obj === 'string') {
        return obj;
    }
    if (obj instanceof mongoose_1.Types.ObjectId) {
        return obj.toString();
    }
    if (obj._id) {
        return obj._id.toString();
    }
    throw new common_1.IntegrityException('Use of invalid object id detected.');
}
exports.assureStringId = assureStringId;
function createBaseEntityInstance(constructor, data) {
    const model = Object.create(constructor.prototype);
    if (typeof model.init === 'function') {
        model.init(data);
    }
    else {
        (0, base_entity_1.assignEntityData)(model, data);
    }
    return model;
}
exports.createBaseEntityInstance = createBaseEntityInstance;
