import { IWebConfig } from './web-config.interface';

let webConfig: IWebConfig;

const defaults: IWebConfig = {
  apiUrl: 'http://localhost:8080/api',
  baseUrl: import.meta.env.BASE_URL,
  modules: {},
};

export async function initWebConfig(overWrites?: Partial<IWebConfig>): Promise<IWebConfig> {
  const loadedConfig = await loadConfig();
  webConfig = Object.assign({}, defaults, loadedConfig, overWrites);
  return webConfig;
}

async function loadConfig() {
  try {
    // const loadedConfig = await import('../../config/lyvely-web.config');
    const loadedConfig = { default: () => ({}) };
    return loadedConfig.default;
  } catch (e) {
    console.warn('No web config loaded, using defaults.');
    return {};
  }
}
