export declare const getQueuedPromise: (id: string) => Promise<any>;
export declare const queuePromise: (id: string, factory: () => Promise<any>) => Promise<any>;
