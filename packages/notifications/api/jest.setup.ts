import 'reflect-metadata';
import { set } from 'leaked-handles';
import { closeInMongodConnection } from '@lyvely/testing';
import { closeInMongodConnections } from '@lyvely/testing/src';

afterAll(async () => {
  await closeInMongodConnections();
});

set({
  fullStack: true, // use full stack traces
  timeout: 5000, // run every 30 seconds instead of 5.
  debugSockets: true, // pretty print tcp thrown exceptions.
});

jest.setTimeout(3000000);
