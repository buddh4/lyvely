import { Logger, Type } from '@nestjs/common';
export interface ITypeRegistryDefinition<T> {
    type: string;
    constructor: Type<T>;
}
export declare abstract class AbstractTypeRegistry<T, TMeta = any> {
    protected abstract logger: Logger;
    private typeMapping;
    private typeMeta;
    registerType(type: Type<T>, name?: string, meta?: TMeta): void;
    registerTypes(types: {
        type: Type<T>;
        name?: string;
        meta?: TMeta;
    }[]): void;
    isRegisteredType(type: string): boolean;
    getTypeDefinition(type: string): ITypeRegistryDefinition<T> | undefined;
    getTypeConstructor(type: string): Type<T> | undefined;
    getTypeMeta(type: string): TMeta | undefined;
}
