"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPropertyTypes = void 0;
const decorators_1 = require("../decorators");
const primitivePrototypes = [
    String.prototype,
    Number.prototype,
    Boolean.prototype,
    BigInt.prototype,
    Symbol.prototype,
];
const primitiveDefaults = new Map();
primitiveDefaults.set(String, '');
primitiveDefaults.set(Number, 0);
primitiveDefaults.set(Boolean, false);
primitiveDefaults.set(Symbol, null);
function initPropertyTypes(model, options = {}) {
    return _initPropertyTypes(model, 0, options);
}
exports.initPropertyTypes = initPropertyTypes;
function _initPropertyTypes(model, level = 0, { maxDepth = 100 } = {}) {
    if (level > maxDepth) {
        return model;
    }
    if (model && typeof model === 'object') {
        const propertyDefinitions = (0, decorators_1.getPropertyTypeDefinitions)(model.constructor);
        Object.keys(propertyDefinitions).forEach((propertyKey) => {
            const propertyDefinition = propertyDefinitions[propertyKey];
            if (!model[propertyKey] && !propertyDefinition.optional) {
                if (propertyDefinition.default) {
                    model[propertyKey] =
                        typeof propertyDefinition.default === 'function'
                            ? propertyDefinition.default()
                            : propertyDefinition.default;
                }
                else if (!propertyDefinition.type) {
                    model[propertyKey] = propertyDefinition.type;
                }
                else if (Array.isArray(propertyDefinition.type)) {
                    model[propertyKey] = [];
                }
                else if (propertyDefinition.type === Date) {
                    model[propertyKey] = new Date();
                }
                else if (!primitivePrototypes.includes(propertyDefinition.type.prototype)) {
                    model[propertyKey] = Object.assign(Object.create(propertyDefinition.type.prototype), model[propertyKey]);
                    if (!propertyDefinition.default &&
                        'afterInit' in model[propertyKey] &&
                        typeof model[propertyKey]['afterInit'] === 'function') {
                        model[propertyKey].afterInit();
                    }
                }
                else {
                    model[propertyKey] = primitiveDefaults.get(propertyDefinition.type);
                }
            }
            _initPropertyTypes(model[propertyKey], level + 1, { maxDepth });
        });
    }
    return model;
}