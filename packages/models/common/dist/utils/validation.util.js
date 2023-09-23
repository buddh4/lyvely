"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeHTML = exports.isGuid = exports.isValidEmail = exports.getValidationFields = exports.applyValidationProperties = exports.REGEX_HEX_COLOR = void 0;
exports.REGEX_HEX_COLOR = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
const class_validator_1 = require("class-validator");
function applyValidationProperties(model, data, level = 0, { maxDepth = 100 } = {}) {
    if (level > maxDepth)
        return model;
    const validationFields = getValidationFields(model);
    Object.keys(data).forEach((property) => {
        if (!Array.isArray(model) && !validationFields.has(property)) {
            return;
        }
        if (Array.isArray(data[property])) {
            model[property] = applyValidationProperties([], data[property], level + 1, { maxDepth });
        }
        else if (data[property] &&
            typeof data[property] === 'object' &&
            model[property] &&
            typeof model[property] === 'object') {
            model[property] = applyValidationProperties(model[property], data[property], level + 1, {
                maxDepth,
            });
        }
        else {
            model[property] = data[property];
        }
    });
    return model;
}
exports.applyValidationProperties = applyValidationProperties;
function getValidationFields(model) {
    if (Array.isArray(model) || !model?.constructor?.name)
        return new Set();
    const validationMetas = (0, class_validator_1.getMetadataStorage)().getTargetValidationMetadatas(model.constructor, model.constructor.name, true, false);
    return new Set(validationMetas?.map((meta) => meta.propertyName) || []);
}
exports.getValidationFields = getValidationFields;
function isValidEmail(email) {
    return (0, class_validator_1.isEmail)(email);
}
exports.isValidEmail = isValidEmail;
function isGuid(guid) {
    return /^[A-Fa-f0-9]{64}$/.test(guid);
}
exports.isGuid = isGuid;
const escapeHTML = (str) => {
    if (!str) {
        return;
    }
    return str.replace(/[&<>'"]/g, (tag) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
    }[tag] || ''));
};
exports.escapeHTML = escapeHTML;
