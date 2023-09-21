import { Type } from '../utils';

type Mapper<TFrom, TTo> = (source: TFrom) => TTo;

type MappingConfig<TFrom, TTo> = { from: any; to: any; mapper: Mapper<TFrom, TTo>; name?: string };

const mappings = [] as MappingConfig<any, any>[];

type ExtractMappedType<P> = P extends Array<Type<infer T>>
  ? T[]
  : P extends Type<infer T>
  ? T
  : never;

export function registerMapping<TFrom = any, TTo = any>(
  from: TFrom,
  to: TTo,
  mapper: Mapper<ExtractMappedType<TFrom>, ExtractMappedType<TTo>>,
  name?: string,
) {
  const fromType = Array.isArray(from) ? from[0] : from;
  const toType = Array.isArray(to) ? to[0] : to;
  mappings.push({ from: fromType, to: toType, mapper, name });
}

export function mapType<TFrom = any, TTo = any>(
  from: TFrom,
  to: TTo,
  obj: ExtractMappedType<TFrom>,
  name?: string,
): ExtractMappedType<TTo> {
  const fromType = Array.isArray(from) ? from[0] : from;
  const toType = Array.isArray(to) ? to[0] : to;
  const mapping = mappings.find(
    (mapping) =>
      (!name || name === mapping.name) && mapping.from === fromType && mapping.to === toType,
  );

  if (!mapping) {
    throw new Error(`Unsupported mapping: ${fromType?.name} => ${toType?.name}`);
  }
  return mapping.mapper(obj);
}
