import type { ILyvelyWebApp } from '@/core';
import { useEventBus } from '../events';

let appInstance: ILyvelyWebApp;

useEventBus().on('app.init.pre', (app) => {
  if (appInstance) throw new Error('Lyvely is already running.');
  appInstance = app;
});

export function useLyvelyApp() {
  if (!appInstance) throw new Error('Called useLyvelyApp prior of app initialization.');
  return appInstance;
}
