import { InjectionToken, Type } from '@nestjs/common';

export interface IPolicy<C> {
  verify(context: C): Promise<boolean>;
}

export type PolicyHandler<C> = IPolicy<C> | Type<IPolicy<C>>;

export interface IPolicyProvider {
  provide: InjectionToken;
  useClass: Type<IPolicy<any>>;
}

export type IPolicyDefinition = IPolicyProvider | Type<IPolicy<any>>;

export interface IPolicyModuleMetadata {
  policies: IPolicyDefinition[];
}

export function getPolicyToken(name: string | Type) {
  return `${name instanceof Function ? name.name : name}Policy`;
}
