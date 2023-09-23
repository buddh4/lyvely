export type Type<T = any> = new (...args: any[]) => T;
export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export type PropertiesOf<T> = T extends T ? Pick<T, NonFunctionPropertyNames<T>> : never;
type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
export type FunctionsOf<T> = Pick<T, FunctionPropertyNames<T>>;
export type Constructor<T> = new (...args: any[]) => T;
export type Lazy<T> = () => Promise<T>;
export {};
