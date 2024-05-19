import { InjectionToken, Logger, Type } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IModuleMetadata } from '../interfaces';

export interface ITypeRegistryDefinition<T> {
  type: InjectionToken;
  constructor: Type<T>;
}

export const EVENT_REGISTRATION = 'EVENT_REGISTRATION';

/**
 * AbstractTypeRegistry is an abstract class that serves as a base for type registries.
 * It provides methods to register, retrieve, and manipulate types and their metadata.
 */
export abstract class AbstractTypeRegistry<T, TMeta = any, TModuleMetaView = any> {
  protected abstract logger: Logger;

  private typeMapping: Map<InjectionToken, ITypeRegistryDefinition<T>> = new Map();
  private typeMeta: Map<InjectionToken, TMeta> = new Map();
  protected emitter: EventEmitter2;

  constructor() {
    this.emitter = new EventEmitter2();
  }

  /**
   * Register a type with a corresponding token and optional metadata.
   *
   * @param {Type<T>} type - The type to be registered.
   * @param {InjectionToken} [token] - A token associated with the type. If not provided, the type's name will be used as the token.
   * @param {TMeta} [meta] - Optional metadata associated with the type.
   * @return {void}
   */
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

  /**
   * Returns the string representation of the given injection token.
   *
   * @param {InjectionToken} token - The injection token for which to get the string representation.
   * @protected
   *
   * @returns {string} - The string representation of the injection token.
   */
  protected getTokenString(token: InjectionToken) {
    if (token instanceof Function) {
      return token.name;
    }

    return token.toString();
  }

  /**
   * Registers an event handler for the registration event.
   *
   * @param {Function} handler - The callback function to be invoked when the registration event occurs.
   *                            It receives one parameter - meta: IModuleMetadata<TModuleMetaView>.
   *
   * @returns {Function} - A function that can be used to remove the registration event handler.
   */
  onRegistration(handler: (meta: IModuleMetadata<TModuleMetaView>) => void): EventEmitter2 {
    return this.emitter.on(EVENT_REGISTRATION, handler) as EventEmitter2;
  }

  /**
   * Registers multiple types.
   *
   * @param {Array} types - An array of type definitions.
   * Each type definition should contain the following properties:
   * - type: The type to be registered.
   * - name (optional): The name of the type. Defaults to null.
   * - meta (optional): Additional metadata associated with the type. Defaults to null.
   *
   * @return {void}
   */
  registerTypes(types: { type: Type<T>; name?: string; meta?: TMeta }[]) {
    types.forEach((type) => this.registerType(type.type, type.name, type.meta));
  }

  /**
   * Checks if a given type is registered.
   *
   * @param {InjectionToken} type - The type to check if it is registered.
   *
   * @return {boolean} - Returns true if the type is registered, false otherwise.
   */
  isRegisteredType(type: InjectionToken): boolean {
    return !!this.getTypeDefinition(type);
  }

  /**
   * Retrieves the type definition associated with the given injection token.
   *
   * @param {InjectionToken} token - The injection token to retrieve the type definition for.
   * @returns {ITypeRegistryDefinition<T> | undefined} - The type definition associated with the injection token, or
   * undefined if no type definition exists.
   */
  getTypeDefinition(token: InjectionToken): ITypeRegistryDefinition<T> | undefined {
    const result = this.typeMapping.get(token);
    if (!result) {
      this.logger.warn(`Type ${this.getTokenString(token)} without type definition requested`);
    }
    return result;
  }

  /**
   * Retrieves the Type constructor associated with the given injection token.
   *
   * @param {InjectionToken} token - The injection token for which to retrieve the Type constructor.
   * @return {Type<T> | undefined} The Type constructor associated with the injection token, or undefined if not found.
   */
  getTypeConstructor(token: InjectionToken): Type<T> | undefined;
  getTypeConstructor(token: InjectionToken, defaultType: Type<T>): Type<T>;
  getTypeConstructor(token: InjectionToken, defaultType?: Type<T>): Type<T> | undefined {
    const definition = this.getTypeDefinition(token);
    return definition ? definition.constructor : defaultType;
  }

  /**
   * Retrieves the metadata associated with the given injection token.
   *
   * @param {InjectionToken} token - The injection token for which to retrieve the metadata.
   *
   * @return {TMeta | undefined} The metadata associated with the given injection token, or undefined if no metadata is found.
   */
  getTypeMeta(token: InjectionToken): TMeta | undefined;
  getTypeMeta(token: InjectionToken, defaultMeta: TMeta): TMeta;
  getTypeMeta(token: InjectionToken, defaultMeta?: TMeta): TMeta | undefined {
    return this.typeMeta.get(token) || defaultMeta;
  }

  /**
   * Retrieves all types from the type mapping.
   *
   * @return {Map<InjectionToken, ITypeRegistryDefinition<T>>} A map object containing all type registrations in the type mapping.
   */
  getAllTypes() {
    return new Map<InjectionToken, ITypeRegistryDefinition<T>>([...this.typeMapping]);
  }

  /**
   * Retrieves all available meta objects.
   *
   * @returns {TMeta[]} - An array of meta objects.
   */
  getAllMeta(): TMeta[] {
    return Array.from(this.typeMeta.values());
  }

  /**
   * Resets the emitter by removing all event listeners.
   *
   * @return {undefined}
   */
  reset() {
    this.emitter?.removeAllListeners();
  }
}
