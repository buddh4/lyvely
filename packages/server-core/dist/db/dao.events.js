"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelSaveEvent = exports.AbstractModelEvent = void 0;
class AbstractModelEvent {
    constructor(sender, model, modelName) {
        this.sender = sender;
        this.model = model;
        this.modelName = modelName;
    }
}
exports.AbstractModelEvent = AbstractModelEvent;
class ModelSaveEvent extends AbstractModelEvent {
}
exports.ModelSaveEvent = ModelSaveEvent;
