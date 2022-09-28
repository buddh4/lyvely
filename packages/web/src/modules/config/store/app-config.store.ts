import { defineStore } from "pinia";
import { ref } from "vue";
import { Status, useStatus } from "@/store/status";
import configRepository from "@/modules/config/repositories/config.repository";
import repository from "@/repository";

interface IAppConfig {
  csrf_token?: string;
}

type ConfigKey = keyof IAppConfig;
type ConfigValue<T extends ConfigKey> = IAppConfig[T];

export const useAppConfigStore = defineStore("app-config", () => {
  const config = ref<IAppConfig>({});
  const status = useStatus();

  async function loadConfig() {
    // TODO: use app config store instead...
    const { data: cfg } = await configRepository.loadConfig();
    config.value = cfg;
    status.setStatus(Status.SUCCESS);
  }

  function get<T extends ConfigKey>(
    cfg: T,
    defaultValue?: ConfigValue<T>
  ): ConfigValue<T> {
    return config.value[cfg] ?? defaultValue;
  }

  return {
    get,
    loadConfig,
    ...status,
  };
});

const configRepositoryPlugin = () => {
  repository.interceptors.request.use(function (config) {
    const appConfigStore = useAppConfigStore();
    config.headers = config.headers || {};
    config.headers["csrf-token"] = appConfigStore.get("csrf_token") || "";
    return config;
  });
};

configRepositoryPlugin();
