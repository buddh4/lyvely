import { InjectionToken, Logger, Type } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { IModuleMetadata } from '../interfaces';

export interface ITypeRegistryDefinition<T> {
  type: InjectionToken;
  constructor: Type<T>;
}

export const EVENT_REGISTRATION = 'EVENT_REGISTRATION';

export abstract class AbstractTypeRegistry<T, TMeta = any, TModuleMetaView = any> {
  protected abstract logger: Logger;

  private typeMapping: Map<InjectionToken, ITypeRegistryDefinition<T>> = new Map();
  private typeMeta: Map<InjectionToken, TMeta> = new Map();
  protected emitter: EventEmitter2;

  constructor() {
    this.emitter = new EventEmitter2();
  }

  registerType(type: Type<T>, token?: InjectionToken, meta?: TMeta) {
    token ||= type.name;
    const definition = { type: token, constructor: type };
    this.logger.log(`Register type ${this.getTokenString(definition.type)}`);
    this.typeMapping.set(definition.type, definition);
    if (meta) {
      this.typeMeta.set(definition.type, meta);
    }

    this.emitter.emit(EVENT_REGISTRATION, meta);
  }

  protected getTokenString(token: InjectionToken) {
    if (token instanceof Function) {
      return token.name;
    }

    return token.toString();
  }

  onRegistration(handler: (meta: IModuleMetadata<TModuleMetaView>) => void) {
    return this.emitter.on(EVENT_REGISTRATION, handler);
  }

  registerTypes(types: { type: Type<T>; name?: string; meta?: TMeta }[]) {
    types.forEach((type) => this.registerType(type.type, type.name, type.meta));
  }

  isRegisteredType(type: InjectionToken): boolean {
    return !!this.getTypeDefinition(type);
  }

  getTypeDefinition(token: InjectionToken): ITypeRegistryDefinition<T> | undefined {
    const result = this.typeMapping.get(token);
    if (!result) {
      this.logger.warn(`Type ${this.getTokenString(token)} without type definition requested`);
    }
    return result;
  }

  getTypeConstructor(token: InjectionToken): Type<T> | undefined {
    const definition = this.getTypeDefinition(token);
    if (definition) {
      return definition.constructor;
    }
    return undefined;
  }

  getTypeMeta(token: InjectionToken): TMeta | undefined {
    return this.typeMeta.get(token);
  }

  getAllTypes() {
    return new Map<InjectionToken, ITypeRegistryDefinition<T>>([...this.typeMapping]);
  }

  getAllMeta(): TMeta[] {
    return Array.from(this.typeMeta.values());
  }

  reset() {
    this.emitter?.removeAllListeners();
  }
}
