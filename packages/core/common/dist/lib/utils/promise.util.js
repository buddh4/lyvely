const promises = {};
export const getQueuedPromise = (id) => {
    return promises[id];
};
const deletePromise = (id) => delete promises[id];
export const queuePromise = (id, factory) => {
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
//# sourceMappingURL=promise.util.js.map