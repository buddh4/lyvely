export type Endpoint<T> = {
  [k in keyof T]: T[k] extends (...args: any) => any ? (...args: any[]) => ReturnType<T[k]> : never;
};

export type StrictEndpoint<T, TNonStrict extends keyof T = never> = {
  [k in keyof T]: k extends TNonStrict
    ? T[k] extends (...args: any) => any
      ? (...args: any) => ReturnType<T[k]>
      : never
    : T[k] extends (...args: any) => any
    ? (arg1: Parameters<T[k]> extends [] ? any : Parameters<T[k]>[0], ...args: any) => ReturnType<T[k]>
    : never;
};

export type EndpointResult<T extends (...args: any) => any> = T extends (...args: any) => infer R ? Awaited<R> : any;

type Test = EndpointResult<() => Promise<void>>;

const a: Test = <any>'';
