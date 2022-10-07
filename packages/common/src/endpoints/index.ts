export type EndPoint<T> = {
  [k in keyof T]: T[k] extends (...args: any) => any ? (...args: any[]) => ReturnType<T[k]> : never;
};

export type StrictEndPoint<T, TNonStrict extends keyof T = never> = {
  [k in keyof T]: k extends TNonStrict
    ? T[k] extends (...args: any) => any
      ? (...args: any) => ReturnType<T[k]>
      : never
    : T[k] extends (...args: any) => any
    ? (arg1: Parameters<T[k]> extends [] ? any : Parameters<T[k]>[0], ...args: any) => ReturnType<T[k]>
    : never;
};
