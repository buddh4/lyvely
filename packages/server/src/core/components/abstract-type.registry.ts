import { Logger, Type } from '@nestjs/common';

export interface ITypeRegistryDefinition<T> {
  type: string;
  constructor: Type<T>;
}

export class AbstractTypeRegistry<T, TMeta = any> {
  constructor(protected readonly logger: Logger) {}

  private typeMapping: Record<string, ITypeRegistryDefinition<T>> = {};
  private typeMeta: Record<string, TMeta> = {};

  registerType(type: Type<T>, meta?: TMeta) {
    const definition = { type: type.name, constructor: type };
    this.logger.log(`Register content type ${definition.type}`);
    this.typeMapping[definition.type] = definition;
    if (meta) {
      this.typeMeta[definition.type] = meta;
    }
  }

  registerTypes(types: { type: Type<T>; meta?: TMeta }[]) {
    types.forEach((type) => this.registerType(type.type, type.meta));
  }

  isRegisteredType(type: string): boolean {
    return !!this.getTypeDefinition(type);
  }

  getTypeDefinition(type: string): ITypeRegistryDefinition<T> | undefined {
    const result = this.typeMapping[type];
    if (!result) {
      this.logger.warn(`Type ${type} without content type definition requested`);
    }
    return result;
  }

  getTypeConstructor(type: string): Type<T> | undefined {
    const definition = this.getTypeDefinition(type);
    if (definition) {
      return definition.constructor;
    }
    return undefined;
  }

  getTypeMeta(type: string): TMeta | undefined {
    return this.typeMeta[type];
  }
}
