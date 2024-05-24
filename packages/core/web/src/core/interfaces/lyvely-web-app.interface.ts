import { App as VueApp } from 'vue';
import { Pinia } from 'pinia';
import { I18n } from 'vue-i18n';
import { IModule, IModuleLoaderOptions } from '../modules';
import { Emitter } from 'mitt';

export interface ILyvelyWebAppOptions extends IModuleLoaderOptions {
  modules?: IModule[];
  apiUrl?: string;
  baseUrl?: string;
  fallbackLocale?: string;
  env?: 'production' | 'development';
}

export type LyvelyAppEvents = {
  'app.init.pre': ILyvelyWebApp;
  'app.init.post': ILyvelyWebApp;
  'app.mount.pre': ILyvelyWebApp;
  'app.mount.post': ILyvelyWebApp;
};

export type LyvelyAppEmitter = Emitter<LyvelyAppEvents>;

export interface ILyvelyWebApp {
  vueApp: VueApp;
  pinia: Pinia;
  i18n: I18n;
  events: LyvelyAppEmitter;
  options: Required<ILyvelyWebAppOptions>;
}
