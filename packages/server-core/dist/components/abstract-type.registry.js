"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTypeRegistry = void 0;
class AbstractTypeRegistry {
    constructor() {
        this.typeMapping = {};
        this.typeMeta = {};
    }
    registerType(type, name, meta) {
        name = name || type.name;
        const definition = { type: name, constructor: type };
        this.logger.log(`Register content type ${definition.type}`);
        this.typeMapping[definition.type] = definition;
        if (meta) {
            this.typeMeta[definition.type] = meta;
        }
    }
    registerTypes(types) {
        types.forEach((type) => this.registerType(type.type, type.name, type.meta));
    }
    isRegisteredType(type) {
        return !!this.getTypeDefinition(type);
    }
    getTypeDefinition(type) {
        const result = this.typeMapping[type];
        if (!result) {
            this.logger.warn(`Type ${type} without content type definition requested`);
        }
        return result;
    }
    getTypeConstructor(type) {
        const definition = this.getTypeDefinition(type);
        if (definition) {
            return definition.constructor;
        }
        return undefined;
    }
    getTypeMeta(type) {
        return this.typeMeta[type];
    }
}
exports.AbstractTypeRegistry = AbstractTypeRegistry;
