"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyConstraints = void 0;
const class_validator_1 = require("class-validator");
function getPropertyConstraints(model, property) {
    return ((0, class_validator_1.getMetadataStorage)()
        .getTargetValidationMetadatas(model.constructor, model.constructor.name, true, false)
        .find((meta) => meta.propertyName === property)?.constraints || []);
}
exports.getPropertyConstraints = getPropertyConstraints;
