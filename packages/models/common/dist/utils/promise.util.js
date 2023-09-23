"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queuePromise = exports.getQueuedPromise = void 0;
const promises = {};
const getQueuedPromise = (id) => {
    return promises[id];
};
exports.getQueuedPromise = getQueuedPromise;
const deletePromise = (id) => delete promises[id];
const queuePromise = (id, factory) => {
    if (!promises[id]) {
        promises[id] = factory()
            .then((res) => {
            deletePromise(id);
            return res;
        })
            .catch((err) => {
            deletePromise(id);
            throw err;
        });
    }
    return promises[id];
};
exports.queuePromise = queuePromise;
