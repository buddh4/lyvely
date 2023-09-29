import { Logger, ModuleMetadata, Type } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';

export interface ITypeRegistryDefinition<T> {
  type: string;
  constructor: Type<T>;
}

export const EVENT_REGISTRATION = 'EVENT_REGISTRATION';

export abstract class AbstractTypeRegistry<T, TMeta = any> {
  protected abstract logger: Logger;

  private typeMapping: Map<string, ITypeRegistryDefinition<T>> = new Map();
  private typeMeta: Map<string, TMeta> = new Map();
  protected emitter: EventEmitter2;

  constructor() {
    this.emitter = new EventEmitter2();
  }

  registerType(type: Type<T>, name?: string, meta?: TMeta) {
    name = name || type.name;
    const definition = { type: name, constructor: type };
    this.logger.log(`Register type ${definition.type}`);
    this.typeMapping.set(definition.type, definition);
    if (meta) {
      this.typeMeta.set(definition.type, meta);
    }

    this.emitter.emit(EVENT_REGISTRATION, meta);
  }

  onRegistration(handler: (meta: ModuleMetadata) => void) {
    return this.emitter.on(EVENT_REGISTRATION, handler);
  }

  registerTypes(types: { type: Type<T>; name?: string; meta?: TMeta }[]) {
    types.forEach((type) => this.registerType(type.type, type.name, type.meta));
  }

  isRegisteredType(type: string): boolean {
    return !!this.getTypeDefinition(type);
  }

  getTypeDefinition(type: string): ITypeRegistryDefinition<T> | undefined {
    const result = this.typeMapping.get(type);
    if (!result) {
      this.logger.warn(`Type ${type} without type definition requested`);
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
    return this.typeMeta.get(type);
  }

  getAllMeta(): TMeta[] {
    return Array.from(this.typeMeta.values());
  }

  reset() {
    this.emitter?.removeAllListeners();
  }
}
