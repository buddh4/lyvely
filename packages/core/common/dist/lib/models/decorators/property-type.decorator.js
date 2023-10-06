import { getPrototypeTree } from '../../utils';
const modelPropertyTypes = new Map();
export function getPropertyTypeDefinitions(type) {
    return getPrototypeTree(type)
        .reverse()
        .reduce((result, prototype) => {
        const definition = modelPropertyTypes.get(prototype);
        return definition ? Object.assign(result, definition) : result;
    }, {});
}
export function getPropertyTypeDefinition(type, propertyKey) {
    const typeDefinition = getPropertyTypeDefinitions(type);
    return typeDefinition ? typeDefinition[propertyKey] : undefined;
}
export function PropertyType(type, options = {}) {
    return function (target, propertyKey) {
        const targetConstructor = target.constructor;
        if (!modelPropertyTypes.has(targetConstructor))
            modelPropertyTypes.set(targetConstructor, {});
        modelPropertyTypes.get(targetConstructor)[propertyKey] = Object.assign({ type }, options);
    };
}
//# sourceMappingURL=property-type.decorator.js.map