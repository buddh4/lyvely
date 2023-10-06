import { getMetadataStorage } from 'class-validator';
export function getPropertyConstraints(model, property) {
    var _a;
    return (((_a = getMetadataStorage()
        .getTargetValidationMetadatas(model.constructor, model.constructor.name, true, false)
        .find((meta) => meta.propertyName === property)) === null || _a === void 0 ? void 0 : _a.constraints) || []);
}
