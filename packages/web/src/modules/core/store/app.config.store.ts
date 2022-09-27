import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Status, useStatus } from "@server/store/status";
import authRepository from "@server/modules/user/repositories/auth.repository";

interface AppConfig {
  csrf_token?: string;
}

type ConfigKey = keyof AppConfig;
type ConfigValue<T extends ConfigKey> = AppConfig[T];

export const useAppConfigStore = defineStore('app-config', () => {
  const config = ref<AppConfig>({});
  const status = useStatus();

  async function loadConfig() {
    const { data: cfg } = await authRepository.loadConfig();
    config.value = cfg;
    status.setStatus(Status.SUCCESS);
  }

  function get<T extends ConfigKey>(cfg: T, defaultValue?: ConfigValue<T>): ConfigValue<T> {
    return config.value[cfg] ?? defaultValue;
  }

  return {
    get,
    loadConfig,
    ...status
  }
});
