import { defineStore } from 'pinia';
import { ref } from 'vue';
import { repository, loadingStatus, useStatus } from '@/core';
import { AppConfig } from '@lyvely/core-interface';
import { AppConfigService } from '@/app-config/services/app-config.service';

type ConfigKey = keyof AppConfig;
type ConfigValue<T extends ConfigKey> = AppConfig[T];

export const useAppConfigStore = defineStore('app-config', () => {
  const config = ref<AppConfig>();
  const status = useStatus();
  const appConfigService = new AppConfigService();

  async function loadConfig() {
    return loadingStatus(appConfigService.getConfig(), status).then(setConfig);
  }

  function setConfig(cfg: AppConfig) {
    config.value = cfg;
  }

  function get<T extends ConfigKey>(
    cfg: T,
    defaultValue?: ConfigValue<T>,
  ): ConfigValue<T> | undefined {
    if (!config.value) return defaultValue;
    return config.value[cfg] ?? defaultValue;
  }

  return {
    get,
    config,
    loadConfig,
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
