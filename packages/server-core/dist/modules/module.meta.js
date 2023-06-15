"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleMeta = void 0;
class ModuleMeta {
    constructor(data) {
        this.id = data.id;
        this.path = data.path;
        this.name = data.name;
        this.description = data.description;
    }
    getId() {
        return this.id;
    }
    getPath() {
        return this.path;
    }
    buildPath(path) {
        return this.path + path;
    }
    getName() {
        return this.name;
    }
}
exports.ModuleMeta = ModuleMeta;
