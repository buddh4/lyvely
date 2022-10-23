import { App } from 'vue';

export interface IModule {
  getId: () => string;
  init?: (app: App) => void;
}
