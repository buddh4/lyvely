import log from 'why-is-node-running';
import 'reflect-metadata';
import { useDayJsDateTimeAdapter } from '@lyvely/dates';

useDayJsDateTimeAdapter();

afterAll(async () => {
  //normal cleanup things
  await new Promise((resolve) => {
    setTimeout(() => {
      log();
      resolve('');
    }, 500);
  });
});
