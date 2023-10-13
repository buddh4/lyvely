import { defineStore } from 'pinia';
import { ref } from 'vue';
import { repository, loadingStatus, useStatus } from '@/core';
import { IAppConfig } from '@lyvely/core-interface';
import { AppConfigService } from '@/app-config/services/app-config.service';
import { findByPath, NestedPaths, TypeFromPath } from '@lyvely/common';
import { GenericObject } from '@lyvely/common/src';

type ConfigKey = keyof IAppConfig;
type ConfigValue<T extends ConfigKey> = IAppConfig[T];

export const useAppConfigStore = defineStore('app-config', () => {
  const config = ref<IAppConfig>();
  const status = useStatus();
  const appConfigService = new AppConfigService();

  async function loadConfig() {
    return loadingStatus(appConfigService.getConfig(), status).then(setConfig);
  }

  function setConfig(cfg: IAppConfig) {
    config.value = cfg;
  }

  function get<T extends ConfigKey>(
    cfg: T,
    defaultValue?: ConfigValue<T>,
  ): ConfigValue<T> | undefined {
    if (!config.value) return defaultValue;
    return config.value[cfg] ?? defaultValue;
  }

  function getModuleConfig<
    TConfig extends GenericObject = GenericObject,
    TResult = any,
    TPath extends NestedPaths<TConfig> = NestedPaths<TConfig>,
  >(moduleId: string, path: TPath, defaultValue: TResult): TResult;
  function getModuleConfig<
    TConfig extends GenericObject = GenericObject,
    TResult = any,
    TPath extends NestedPaths<TConfig> = NestedPaths<TConfig>,
  >(moduleId: string, path: TPath, defaultValue?: TResult): TResult | undefined;
  function getModuleConfig<
    TConfig extends GenericObject = GenericObject,
    TResult = any,
    TPath extends NestedPaths<TConfig> = NestedPaths<TConfig>,
  >(moduleId: string, path?: TPath, defaultValue?: TResult): TResult | undefined {
    if (!config.value) return defaultValue;

    const moduleConfig = config.value.modules[moduleId];

    if (!moduleConfig) return defaultValue;
    if (!path) return moduleConfig as TResult;

    return findByPath<TResult>(moduleConfig, path as string) || defaultValue;
  }

  return {
    get,
    config,
    loadConfig,
    getModuleConfig,
    ...status,
  };
});

const configRepositoryPlugin = () => {
  repository.interceptors.request.use(function (config) {
    const appConfigStore = useAppConfigStore();
    config.headers = config.headers || {};
    config.headers['csrf-token'] = appConfigStore.get('csrf_token') || '';
    return config;
  });
};

configRepositoryPlugin();
