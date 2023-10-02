import 'reflect-metadata';
import { useDayJsDateTimeAdapter } from '@lyvely/dates';
import { closeInMongodConnections } from '@lyvely/testing';

useDayJsDateTimeAdapter();

afterAll(async () => {
  await closeInMongodConnections();
});
