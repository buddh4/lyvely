import 'reflect-metadata';
import fs from 'fs';
import { useDayJsDateTimeAdapter } from '@lyvely/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { globalEmitter } from '@/core';
import 'dayjs/locale/de';
import 'dayjs/locale/en';

useDayJsDateTimeAdapter();

/*jest.setTimeout(3000000);

(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'lyvely' });

  // your code here

  await mongoose.disconnect();
})();*/

beforeEach(() => {
  const testMailsDir = './mail/content-stream/test';
  globalEmitter.removeAllListeners();
  if (fs.existsSync(testMailsDir)) {
    fs.readdirSync(testMailsDir).forEach((f) => fs.rmSync(`${testMailsDir}/${f}`));
  }
});
