const promises: Record<string, Promise<any>> = {};

export const getQueuedPromise = (id: string) => {
  return promises[id];
};

const deletePromise = (id: string) => delete promises[id];

export const queuePromise = (id: string, factory: () => Promise<any>) => {
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
