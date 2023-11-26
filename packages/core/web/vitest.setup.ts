import 'reflect-metadata';
import { useDayJsDateTimeAdapter } from '@lyvely/dates';
import { setLocale, setupI18n } from './src';
import { beforeAll } from 'vitest';

useDayJsDateTimeAdapter();

beforeAll(async () => {
  setupI18n();
  await setLocale('en-us');
});
