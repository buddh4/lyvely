import { Type } from './util.types';
export declare function findByPath<T>(model: T, path: string, parent?: boolean, create?: boolean): any;
export declare function isObjectId(value: any): boolean;
export declare function getPrototypeTree(type: Type): Array<Type>;
export declare function useSingleton<T>(create: () => T): <TR extends T = T>() => TR;
