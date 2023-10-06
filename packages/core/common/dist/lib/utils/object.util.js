export function findByPath(model, path, parent = false, create = true) {
    if (!path.includes('.')) {
        return parent ? model : model[path];
    }
    path = parent ? path.replace(/\.[^/.]+$/, '') : path;
    let result = model;
    const subPaths = path.split('.');
    subPaths.forEach((sub, index) => {
        if ((sub && sub.length && sub.charAt(0) === '$') || /^[0-9]+$/.test(sub)) {
            result = undefined;
        }
        else if (result && !result[sub] && create && index !== subPaths.length) {
            result[sub] = {};
        }
        result = result && result[sub] ? result[sub] : undefined;
    });
    return result;
}
export function isObjectId(value) {
    return value && typeof value === 'object' && value._bsontype && value._bsontype === 'ObjectID';
}
export function getPrototypeTree(type) {
    let curr = type;
    const prototypeTree = [type];
    do {
        curr = Object.getPrototypeOf(curr);
        if (Object.getPrototypeOf(curr) === Object.prototype)
            break;
        prototypeTree.push(curr);
    } while (curr);
    return prototypeTree;
}
export function useSingleton(create) {
    let instance;
    return () => {
        if (!instance) {
            instance = create();
        }
        return instance;
    };
}
//# sourceMappingURL=object.util.js.map