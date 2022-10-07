export type Type<T = any> = new (...args: any[]) => T;

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
export type PropertiesOf<T> = Pick<T, NonFunctionPropertyNames<T>>;

type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
export type FunctionsOf<T> = Pick<T, FunctionPropertyNames<T>>;

export declare type Constructor<T> = new (...args: any[]) => T;
