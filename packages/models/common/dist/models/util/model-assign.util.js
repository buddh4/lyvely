"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignRawDataTo = exports.assignRawDataToAndInitProps = exports.createAndAssign = void 0;
const utils_1 = require("../../utils");
const model_property_type_util_1 = require("./model-property-type.util");
const decorators_1 = require("../decorators");
function createAndAssign(type, data, options = {}) {
    return assignRawDataToAndInitProps(Object.create(type.prototype), data, options);
}
exports.createAndAssign = createAndAssign;
function assignRawDataToAndInitProps(model, data, options = {}) {
    assignRawDataTo(model, data, options);
    (0, model_property_type_util_1.initPropertyTypes)(model);
    return model;
}
exports.assignRawDataToAndInitProps = assignRawDataToAndInitProps;
function assignRawDataTo(model, data, { maxDepth = 100, strict = false, transform = undefined } = {}) {
    return _assignRawDataTo(model, data, 0, { maxDepth, strict, transform });
}
exports.assignRawDataTo = assignRawDataTo;
const BLACKLISTED_PATH = ['__proto__', 'prototype', 'constructor'];
function _assignRawDataTo(model, data, level = 0, { maxDepth = 100, strict = false, transform = undefined } = {}) {
    if (!data || level > maxDepth) {
        return model;
    }
    Object.keys(data).forEach((path) => {
        if (path.includes('.')) {
            const subPathRoot = (0, utils_1.findByPath)(model, path, true, !strict);
            if (subPathRoot) {
                const field = path.slice(path.lastIndexOf('.') + 1);
                if (field.startsWith('$'))
                    return;
                _assignRawDataTo(subPathRoot, { [field]: data[path] });
            }
            return;
        }
        if (BLACKLISTED_PATH.includes(path))
            return;
        if (typeof model === 'object' && strict && !Object.hasOwn(model, path))
            return;
        const transformed = transform ? transform(data[path], path) : undefined;
        if (transformed !== undefined) {
            model[path] = transformed;
        }
        else if (Array.isArray(data[path])) {
            let arrayData = data[path];
            const arrayType = (0, decorators_1.getPropertyTypeDefinition)(model.constructor, path)?.type;
            if (arrayType && Array.isArray(arrayType) && arrayType.length) {
                arrayData = data[path].map((entry) => _transformType(entry, arrayType[0]));
            }
            model[path] = _assignRawDataTo([], arrayData, level + 1, { maxDepth, strict, transform });
        }
        else if ((0, utils_1.isObjectId)(data[path])) {
            model[path] = data[path];
        }
        else if (data[path] && typeof data[path] === 'object' && !(data[path] instanceof Date)) {
            const propertyTypeDefinition = (0, decorators_1.getPropertyTypeDefinition)(model.constructor, path);
            let propertyType = propertyTypeDefinition?.type;
            if (!propertyTypeDefinition) {
                propertyType = !model[path]
                    ? data[path].constructor
                    : getSpecificConstructor(model[path], data[path]);
            }
            if (_isOfType(data[path], propertyType)) {
                model[path] = data[path];
            }
            else if (PRIMITIVE_TYPES.includes(propertyType)) {
                model[path] = null;
            }
            else {
                model[path] = _assignRawDataTo(Object.assign(Object.create(propertyType.prototype), model[path]), data[path], level + 1, { maxDepth, strict, transform });
            }
            if (model[path] &&
                typeof model[path] === 'object' &&
                'afterInit' in model[path] &&
                typeof model[path]['afterInit'] === 'function') {
                model[path].afterInit();
            }
        }
        else if (typeof data[path] !== 'function') {
            const propertyTypeDefinition = (0, decorators_1.getPropertyTypeDefinition)(model.constructor, path);
            const propertyType = propertyTypeDefinition?.type;
            if (typeof data[path] === 'string' && propertyType === Date) {
                try {
                    model[path] = new Date(data[path]);
                }
                catch (err) {
                    console.warn(err, 'Tried to assign invalid string date to model property');
                    model[path] = data[path];
                }
            }
            else {
                model[path] = propertyTypeDefinition
                    ? _transformType(data[path], propertyType)
                    : data[path];
            }
        }
    });
    return model;
}
function _isOfType(value, type) {
    if ([null, undefined, String, Number, Boolean, BigInt, Symbol].includes(type)) {
        if (type === null)
            return value === null;
        if (type === undefined)
            return value === undefined;
        if (type === String)
            return typeof value === 'string';
        if (type === Number)
            return typeof value === 'number';
        if (type === Boolean)
            return typeof value === 'boolean';
        if (type === BigInt)
            return typeof value === 'bigint';
        if (type === Symbol)
            return value === type;
    }
    return value instanceof type;
}
const PRIMITIVE_TYPES = [null, undefined, String, Number, Boolean, BigInt, Symbol];
const PRIMITIVE_TYPES_WITH_TOSTRING = ['number', 'boolean', 'bigint', 'symbol'];
function _isPrimitiveType(type) {
    return PRIMITIVE_TYPES.includes(type);
}
function _transformType(value, type) {
    if (value === undefined || value === null || _isOfType(value, type))
        return value;
    if (type === null || type === undefined)
        return type;
    if (_isPrimitiveType(type)) {
        if (type === String) {
            return PRIMITIVE_TYPES_WITH_TOSTRING.includes(typeof value) ? value.toString() : null;
        }
        if (type === Number) {
            if (typeof value === 'string') {
                try {
                    return !isNaN(value) ? parseFloat(value) : null;
                }
                catch (e) {
                    return null;
                }
            }
            else if (typeof value === 'bigint')
                return Number(value);
            else if (typeof value === 'boolean')
                return value ? 1 : 0;
            else
                return null;
        }
        if (type === Boolean) {
            return ['true', 'false', '0', '1', 1, 0].includes(value)
                ? ['true', '1', 1].includes(value)
                : null;
        }
        if (type === BigInt) {
            try {
                return BigInt(value);
            }
            catch (e) {
                return null;
            }
        }
        if (type === Symbol)
            return type;
        return null;
    }
    return Object.assign(Object.create(type.prototype), value);
}
function getSpecificConstructor(a, b) {
    return a.constructor === Object.constructor ? b.constructor : a.constructor;
}
