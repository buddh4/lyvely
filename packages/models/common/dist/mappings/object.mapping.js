"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapType = exports.registerMapping = void 0;
const mappings = [];
function registerMapping(from, to, mapper, name) {
    const fromType = Array.isArray(from) ? from[0] : from;
    const toType = Array.isArray(to) ? to[0] : to;
    mappings.push({ from: fromType, to: toType, mapper, name });
}
exports.registerMapping = registerMapping;
function mapType(from, to, obj, name) {
    const fromType = Array.isArray(from) ? from[0] : from;
    const toType = Array.isArray(to) ? to[0] : to;
    const mapping = mappings.find((mapping) => (!name || name === mapping.name) && mapping.from === fromType && mapping.to === toType);
    if (!mapping) {
        throw new Error(`Unsupported mapping: ${fromType?.name} => ${toType?.name}`);
    }
    return mapping.mapper(obj);
}
exports.mapType = mapType;
