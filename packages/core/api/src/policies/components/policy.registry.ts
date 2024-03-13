import { Injectable, InjectionToken, Logger } from '@nestjs/common';
import { AbstractTypeRegistry, useModuleRegistry, IModuleMetadata, ModuleRegistry } from '@/core';
import {
  IPolicy,
  IPolicyDefinition,
  IPolicyModuleMetadata,
  IPolicyProvider,
  getPolicyToken,
} from '../interfaces';
import { useSingleton, Type } from '@lyvely/common';

@Injectable()
export class PolicyRegistry extends AbstractTypeRegistry<IPolicy<any>> {
  protected logger = new Logger(PolicyRegistry.name);

  constructor() {
    super();
    const moduleRegistry = useModuleRegistry<ModuleRegistry<IPolicyModuleMetadata>>();
    moduleRegistry.getAllMeta().forEach((moduleMeta) => this.registerOverwrites(moduleMeta));
    moduleRegistry.onRegistration((moduleMeta: IModuleMetadata<IPolicyModuleMetadata>) =>
      this.registerOverwrites(moduleMeta),
    );
  }

  override registerType(type: Type<IPolicy<any>>, token?: InjectionToken) {
    token ??= type;
    token = token instanceof Function ? getPolicyToken(token.name) : token;
    super.registerType(type, token, { provide: token, useClass: type });
  }

  private definitionToProvider(definition?: IPolicyDefinition) {
    return definition instanceof Function
      ? { provide: definition, useClass: definition }
      : definition;
  }

  private registerOverwrites(moduleMeta: IModuleMetadata<IPolicyModuleMetadata>) {
    if (Array.isArray(moduleMeta.policies)) {
      moduleMeta.policies.forEach((definition: IPolicyDefinition) => {
        if (definition instanceof Function) {
          this.registerType(definition);
        } else {
          this.registerType(definition.useClass, definition.provide);
        }
      });
    }
  }

  public getProviders(): IPolicyProvider[] {
    return [...this.getAllMeta()];
  }
}

export const usePolicyRegistry = useSingleton(() => new PolicyRegistry());
