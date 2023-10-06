import { Type } from '../utils';
type Mapper<TFrom, TTo> = (source: TFrom) => TTo;
type ExtractMappedType<P> = P extends Array<Type<infer T>> ? T[] : P extends Type<infer T> ? T : never;
export declare function registerMapping<TFrom = any, TTo = any>(from: TFrom, to: TTo, mapper: Mapper<ExtractMappedType<TFrom>, ExtractMappedType<TTo>>, name?: string): void;
export declare function mapType<TFrom = any, TTo = any>(from: TFrom, to: TTo, obj: ExtractMappedType<TFrom>, name?: string): ExtractMappedType<TTo>;
export {};
