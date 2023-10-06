const mappings = [];
export function registerMapping(from, to, mapper, name) {
    const fromType = Array.isArray(from) ? from[0] : from;
    const toType = Array.isArray(to) ? to[0] : to;
    mappings.push({ from: fromType, to: toType, mapper, name });
}
export function mapType(from, to, obj, name) {
    const fromType = Array.isArray(from) ? from[0] : from;
    const toType = Array.isArray(to) ? to[0] : to;
    const mapping = mappings.find((mapping) => (!name || name === mapping.name) && mapping.from === fromType && mapping.to === toType);
    if (!mapping) {
        throw new Error(`Unsupported mapping: ${fromType === null || fromType === void 0 ? void 0 : fromType.name} => ${toType === null || toType === void 0 ? void 0 : toType.name}`);
    }
    return mapping.mapper(obj);
}
//# sourceMappingURL=object.mapping.js.map