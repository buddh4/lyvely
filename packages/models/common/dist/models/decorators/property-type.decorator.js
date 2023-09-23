"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyType = exports.getPropertyTypeDefinition = exports.getPropertyTypeDefinitions = void 0;
const utils_1 = require("../../utils");
const modelPropertyTypes = new Map();
function getPropertyTypeDefinitions(type) {
    return (0, utils_1.getPrototypeTree)(type)
        .reverse()
        .reduce((result, prototype) => {
        const definition = modelPropertyTypes.get(prototype);
        return definition ? Object.assign(result, definition) : result;
    }, {});
}
exports.getPropertyTypeDefinitions = getPropertyTypeDefinitions;
function getPropertyTypeDefinition(type, propertyKey) {
    const typeDefinition = getPropertyTypeDefinitions(type);
    return typeDefinition ? typeDefinition[propertyKey] : undefined;
}
exports.getPropertyTypeDefinition = getPropertyTypeDefinition;
function PropertyType(type, options = {}) {
    return function (target, propertyKey) {
        const targetConstructor = target.constructor;
        if (!modelPropertyTypes.has(targetConstructor))
            modelPropertyTypes.set(targetConstructor, {});
        modelPropertyTypes.get(targetConstructor)[propertyKey] = Object.assign({ type }, options);
    };
}
exports.PropertyType = PropertyType;
