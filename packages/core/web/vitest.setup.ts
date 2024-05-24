import 'reflect-metadata';
import { type ILyvelyWebApp, setLocale, setupI18n, useEventBus } from './src';
import { beforeAll } from 'vitest';

beforeAll(async () => {
  const eventBus = useEventBus();
  const lyvelyAppMock: ILyvelyWebApp = {
    options: {
      env: 'development',
      apiUrl: '',
      baseUrl: '',
      modules: [],
      fallbackLocale: 'en-us',
    },
    vueApp: undefined,
    pinia: undefined,
    events: eventBus,
    i18n: undefined,
  };

  useEventBus().emit('app.init.pre', lyvelyAppMock);

  lyvelyAppMock.i18n = setupI18n({ fallbackLocale: 'en-us' });

  useEventBus().emit('app.init.post', lyvelyAppMock);
  await setLocale('en-us');
});
