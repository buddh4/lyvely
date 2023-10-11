import 'reflect-metadata';
import fs from 'fs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { globalEmitter } from './src/global.emitter';
import { closeInMongodConnections } from './src/testing/core-test.util';
//import { set } from 'leaked-handles';

/*set({
  fullStack: true, // use full stack traces
  timeout: 5000, // run every 30 seconds instead of 5.
  debugSockets: true, // pretty print tcp thrown exceptions.
});*/

/*jest.setTimeout(3000000);

(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'lyvely' });

  // your code here

  await mongoose.disconnect();
})();*/

afterEach(async () => {
  //await closeInMongodConnections();
});
