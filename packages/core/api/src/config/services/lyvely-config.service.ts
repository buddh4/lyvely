import { ConfigService } from '@nestjs/config';
import type { Path, PathValue } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import type { ServerConfiguration } from '@/core/interfaces';
import { TenancyIsolation, TenancyService } from '@/core/tenancy';
import { findByPath } from '@lyvely/common';

type KeyOf<T> = keyof T extends never ? string : keyof T & string;

type ContainsDots = `${string}.${string}`;

type IsAny<T> = unknown extends T ? ([keyof T] extends [never] ? false : true) : false;

@Injectable()
export class LyvelyConfigService<
  TModuleView extends Record<string, any> = any,
  K extends ServerConfiguration<TModuleView> = ServerConfiguration<TModuleView>,
> {
  constructor(
    private readonly configService: ConfigService<K>,
    private readonly tenancyService: TenancyService
  ) {}

  get<T = any, P extends Path<K> = Path<K>>(
    propertyPath: P
  ): IsAny<T> extends false ? T : P extends Path<K> ? PathValue<K, P> : T;
  get<T = any, P extends Path<K> = Path<K>>(
    propertyPath: P,
    defaultValue: NoInfer<T>
  ): IsAny<T> extends false ? T : P extends Path<K> ? NonNullable<PathValue<K, P>> : T;
  get<T = any, P extends ContainsDots = ContainsDots>(propertyPath: P, defaultValue: NoInfer<T>): T;
  get<T = any, P extends Path<Required<K>> = Path<Required<K>>>(
    propertyPath: P,
    defaultValue?: NoInfer<T>
  ): IsAny<T> extends false ? T : P extends Path<K> ? PathValue<K, P> : T {
    const tenantConfig = this.getTenantConfig(propertyPath);
    if (tenantConfig) return tenantConfig;
    return defaultValue
      ? (this.configService.get(propertyPath as any, defaultValue as any) as any)
      : (this.configService.get(propertyPath as any) as any);
  }

  /**
   * Retrieves the configuration value from the tenant's config object based on the provided path.
   *
   * @param {string} path - The path to the desired configuration value.
   * @private
   * @template T - The type of the return value.
   * @returns {T | undefined} - The configuration value if found, undefined otherwise.
   */
  private getTenantConfig<T = any>(path: string): T | undefined {
    // At the moment we only support custom config for strict tenancy isolation
    if (this.tenancyService.getIsolationLevel() !== TenancyIsolation.Strict) return;
    const tenant = this.tenancyService.getTenant();
    if (!tenant || !tenant.config) return;
    return findByPath(tenant.config, path);
  }

  getOrThrow<T = any, P extends Path<K> = Path<K>>(
    propertyPath: P
  ): IsAny<T> extends false ? T : P extends Path<K> ? NonNullable<PathValue<K, P>> : T {
    const tenantConfig = this.getTenantConfig(propertyPath);
    if (tenantConfig) return tenantConfig;
    return this.configService.getOrThrow(propertyPath as any) as any;
  }

  getModuleConfig<T = any, M extends keyof TModuleView | string = keyof TModuleView | string>(
    moduleId: M
  ): IsAny<T> extends false ? T : M extends Path<TModuleView> ? PathValue<TModuleView, M> : T;
  getModuleConfig<
    T = any,
    M extends keyof TModuleView | string = keyof TModuleView | string,
    P extends Path<TModuleView[M]> | T = Path<TModuleView[M]> | T,
  >(
    moduleId: M,
    propertyOrDefault: P
  ): IsAny<T> extends false
    ? T
    : P extends Path<TModuleView[M]>
      ? PathValue<TModuleView[M], P>
      : P extends object
        ? TModuleView[M]
        : T;
  getModuleConfig<
    T = any,
    M extends keyof TModuleView & string = keyof TModuleView & string,
    P extends Path<TModuleView[M]> = Path<TModuleView[M]>,
  >(
    moduleId: M,
    propertyPath: P,
    defaultValue: NoInfer<T>
  ): IsAny<T> extends false ? T : PathValue<TModuleView[M], P>;
  getModuleConfig<T = any>(moduleId: string, propertyPath: string, defaultValue: T): T;
  getModuleConfig<
    T = any,
    M extends keyof TModuleView & string = keyof TModuleView & string,
    P extends Path<TModuleView[M]> = Path<TModuleView[M]>,
  >(
    moduleId: M,
    propertyPath?: P,
    defaultValue?: NoInfer<T>
  ): IsAny<T> extends false ? T : PathValue<TModuleView[M], P> {
    if (typeof propertyPath === 'object') {
      return this.get<T>(`modules.${moduleId}` as any, propertyPath) as any;
    }

    if (typeof propertyPath === 'string') {
      return this.get<T>(`modules.${moduleId}.${propertyPath}` as any, defaultValue as any) as any;
    }

    return this.get<T>(`modules.${moduleId}` as any, defaultValue as any) as any;
  }

  getModuleConfigOrThrow<
    T = any,
    M extends keyof TModuleView = keyof TModuleView,
    P extends Path<TModuleView[M]> = Path<TModuleView[M]>,
  >(
    moduleId: M,
    propertyPath: P
  ): IsAny<T> extends false ? T : NonNullable<PathValue<TModuleView[M], P>>;
  getModuleConfigOrThrow<
    T = any,
    M extends keyof TModuleView & string = keyof TModuleView & string,
    P extends Path<TModuleView[M]> = Path<TModuleView[M]>,
  >(
    moduleId: M,
    propertyPath: P
  ): IsAny<T> extends false ? T : NonNullable<PathValue<TModuleView[M], P>> {
    if (typeof propertyPath === 'string') {
      return this.get<T>(`modules.${moduleId}.${propertyPath}` as any) as any;
    }

    return this.get<T>(`modules.${moduleId}` as any) as any;
  }

  set<T = any>(propertyPath: KeyOf<K>, value: T): void {
    this.configService.set<T>(propertyPath, value);
  }
}
