type Primitive = string | number | symbol;
export type GenericObject = Record<Primitive, unknown>;
type Join<L extends Primitive | undefined, R extends Primitive | undefined> = L extends undefined ? R : L extends string | number ? R extends string | number ? `${L}.${R}` : L : R extends string | number ? R : undefined;
type Union<L extends unknown | undefined, R extends unknown | undefined> = L extends undefined ? R extends undefined ? undefined : R : R extends undefined ? L : L | R;
export type NestedPaths<T extends GenericObject & any, Prev extends PropertyKey | undefined = undefined, Path extends PropertyKey | undefined = undefined> = T extends infer O ? {
    [K in keyof O]: O[K] extends GenericObject ? NestedPaths<O[K], Union<Prev, Path>, Join<Path, K>> : Union<Union<Prev, Path>, Join<Path, K>>;
}[keyof O] : never;
export type TypeFromPath<T extends GenericObject, Path extends NestedPaths<T>> = {
    [K in Path]: K extends keyof T ? T[K] : K extends `${infer P}.${infer S}` ? T[P] extends GenericObject ? S extends NestedPaths<T[P]> ? TypeFromPath<T[P], S> : never : never : never;
}[Path];
export {};
