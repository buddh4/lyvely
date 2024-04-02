export type Type<T = any> = new (...args: any[]) => T;

export type Primitive = string | number | symbol | bigint | boolean | undefined | null;

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K extends PropertyKey ? K : never;
}[keyof T];

export type PropertiesOf<T> = T extends T ? Pick<T, NonFunctionPropertyNames<T>> : never;

export type PartialPropertiesOf<T> = Partial<PropertiesOf<T>>;

type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
export type FunctionsOf<T> = Pick<T, FunctionPropertyNames<T>>;

export type Lazy<T> = () => Promise<{ default: T }>;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
