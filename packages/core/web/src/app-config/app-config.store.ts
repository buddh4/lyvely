import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loadingStatus, useStatus, eventBus } from '@/core';
import { IAppConfig, useAppConfigClient } from '@lyvely/interface';
import { findByPath, NestedPaths } from '@lyvely/common';
import { EVENT_APP_CONFIG_LOADED } from './app-config.constants';

type ConfigKey = keyof IAppConfig;
type ConfigValue<T extends ConfigKey> = IAppConfig[T];

export const useAppConfigStore = defineStore('app-config', () => {
  const config = ref<IAppConfig>();
  const status = useStatus();
  const appConfigClient = useAppConfigClient();

  async function loadConfig() {
    return loadingStatus(appConfigClient.getConfig(), status).then(setConfig);
  }

  function setConfig(cfg: IAppConfig) {
    config.value = cfg;
    eventBus.emit(EVENT_APP_CONFIG_LOADED, cfg);
  }

  function get<T extends ConfigKey>(cfg: T, defaultValue: ConfigValue<T>): ConfigValue<T>;
  function get<T extends ConfigKey>(cfg: T, defaultValue?: undefined): ConfigValue<T> | undefined;
  function get<T extends ConfigKey>(
    cfg: T,
    defaultValue?: ConfigValue<T>,
  ): ConfigValue<T> | undefined {
    if (!config.value) return defaultValue;
    return config.value[cfg] ?? defaultValue;
  }

  function getModuleConfig<
    TConfig = undefined,
    TResult = any,
    TPath extends NestedPaths<TConfig> | string = TConfig extends undefined
      ? 'string'
      : NestedPaths<TConfig>,
  >(moduleId: string, path: TPath, defaultValue: TResult): TResult;
  function getModuleConfig<
    TConfig = undefined,
    TResult = any,
    TPath extends NestedPaths<TConfig> | string = TConfig extends undefined
      ? 'string'
      : NestedPaths<TConfig>,
  >(moduleId: string, path?: TPath, defaultValue?: TResult): TResult | undefined;
  function getModuleConfig<
    TConfig = undefined,
    TResult = any,
    TPath extends NestedPaths<TConfig> | string = TConfig extends undefined
      ? 'string'
      : NestedPaths<TConfig>,
  >(moduleId: string, path: TPath, defaultValue: TResult): TResult;
  function getModuleConfig<
    TConfig = undefined,
    TResult = any,
    TPath extends NestedPaths<TConfig> | string = TConfig extends undefined
      ? 'string'
      : NestedPaths<TConfig>,
  >(moduleId: string, path?: TPath, defaultValue?: TResult): TResult | undefined;
  function getModuleConfig<
    TConfig = any,
    TResult = any,
    TPath extends NestedPaths<TConfig> | string = TConfig extends undefined
      ? 'string'
      : NestedPaths<TConfig>,
  >(moduleId: string, path?: TPath, defaultValue?: TResult): TResult | undefined {
    if (!config.value) return defaultValue;

    const moduleConfig = config.value.modules[moduleId];

    if (!moduleConfig) return defaultValue;
    if (!path) return moduleConfig as TResult;

    return findByPath<TResult>(moduleConfig, path as string) ?? defaultValue;
  }

  return {
    get,
    config,
    loadConfig,
    getModuleConfig,
    ...status,
  };
});
